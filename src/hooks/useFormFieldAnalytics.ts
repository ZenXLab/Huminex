import { useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FieldInteraction {
  fieldName: string;
  fieldType: string;
  focusTime: number;
  blurTime?: number;
  timeSpentMs?: number;
  hasError: boolean;
  wasAbandoned: boolean;
  value?: string;
}

interface FormAnalytics {
  formId: string;
  formName: string;
  startTime: number;
  endTime?: number;
  totalTimeMs?: number;
  fields: FieldInteraction[];
  wasSubmitted: boolean;
  wasAbandoned: boolean;
}

const generateSessionId = () => {
  const existing = sessionStorage.getItem("clickstream_session");
  if (existing) return existing;
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("clickstream_session", sessionId);
  return sessionId;
};

export const useFormFieldAnalytics = (formId?: string, formName?: string) => {
  const sessionId = generateSessionId();
  const currentFormRef = useRef<FormAnalytics | null>(null);
  const fieldTimersRef = useRef<Map<string, number>>(new Map());

  // Initialize form tracking
  const initFormTracking = useCallback((id: string, name: string) => {
    currentFormRef.current = {
      formId: id,
      formName: name,
      startTime: Date.now(),
      fields: [],
      wasSubmitted: false,
      wasAbandoned: false,
    };
  }, []);

  // Track field focus
  const trackFieldFocus = useCallback((fieldName: string, fieldType: string) => {
    fieldTimersRef.current.set(fieldName, Date.now());
    
    if (currentFormRef.current) {
      const existingField = currentFormRef.current.fields.find(f => f.fieldName === fieldName);
      if (!existingField) {
        currentFormRef.current.fields.push({
          fieldName,
          fieldType,
          focusTime: Date.now(),
          hasError: false,
          wasAbandoned: false,
        });
      }
    }
  }, []);

  // Track field blur
  const trackFieldBlur = useCallback((fieldName: string, hasError: boolean, value?: string) => {
    const focusTime = fieldTimersRef.current.get(fieldName);
    const blurTime = Date.now();
    const timeSpentMs = focusTime ? blurTime - focusTime : 0;

    if (currentFormRef.current) {
      const fieldIndex = currentFormRef.current.fields.findIndex(f => f.fieldName === fieldName);
      if (fieldIndex >= 0) {
        currentFormRef.current.fields[fieldIndex] = {
          ...currentFormRef.current.fields[fieldIndex],
          blurTime,
          timeSpentMs,
          hasError,
          value: value ? (value.length > 0 ? "filled" : "empty") : undefined,
        };
      }
    }

    // Store field interaction event
    storeFieldEvent("field_blur", fieldName, { timeSpentMs, hasError });
  }, []);

  // Track field error
  const trackFieldError = useCallback((fieldName: string, errorMessage: string) => {
    if (currentFormRef.current) {
      const field = currentFormRef.current.fields.find(f => f.fieldName === fieldName);
      if (field) {
        field.hasError = true;
      }
    }
    storeFieldEvent("field_error", fieldName, { errorMessage });
  }, []);

  // Track form submission
  const trackFormSubmit = useCallback(() => {
    if (currentFormRef.current) {
      currentFormRef.current.wasSubmitted = true;
      currentFormRef.current.endTime = Date.now();
      currentFormRef.current.totalTimeMs = 
        currentFormRef.current.endTime - currentFormRef.current.startTime;
      
      storeFormEvent("form_submit", currentFormRef.current);
    }
  }, []);

  // Track form abandonment
  const trackFormAbandonment = useCallback(() => {
    if (currentFormRef.current && !currentFormRef.current.wasSubmitted) {
      currentFormRef.current.wasAbandoned = true;
      currentFormRef.current.endTime = Date.now();
      currentFormRef.current.totalTimeMs = 
        currentFormRef.current.endTime - currentFormRef.current.startTime;
      
      // Mark incomplete fields as abandoned
      currentFormRef.current.fields.forEach(field => {
        if (!field.blurTime) {
          field.wasAbandoned = true;
        }
      });
      
      storeFormEvent("form_abandonment", currentFormRef.current);
    }
  }, []);

  // Store field-level event
  const storeFieldEvent = async (
    eventType: string,
    fieldName: string,
    metadata: Record<string, any>
  ) => {
    try {
      await supabase.from("clickstream_events").insert({
        session_id: sessionId,
        event_type: eventType,
        page_url: window.location.pathname,
        element_id: fieldName,
        element_text: fieldName,
        metadata: {
          ...metadata,
          formId: currentFormRef.current?.formId,
          formName: currentFormRef.current?.formName,
        },
      });
    } catch (error) {
      console.error("Form field analytics error:", error);
    }
  };

  // Store form-level event
  const storeFormEvent = async (eventType: string, formData: FormAnalytics) => {
    try {
      await supabase.from("clickstream_events").insert({
        session_id: sessionId,
        event_type: eventType,
        page_url: window.location.pathname,
        element_id: formData.formId,
        element_text: formData.formName,
        metadata: {
          totalTimeMs: formData.totalTimeMs,
          fieldsInteracted: formData.fields.length,
          fieldsWithErrors: formData.fields.filter(f => f.hasError).length,
          fieldsAbandoned: formData.fields.filter(f => f.wasAbandoned).length,
          fieldDetails: formData.fields.map(f => ({
            name: f.fieldName,
            type: f.fieldType,
            timeSpentMs: f.timeSpentMs,
            hasError: f.hasError,
            wasAbandoned: f.wasAbandoned,
          })),
        },
      });
    } catch (error) {
      console.error("Form analytics error:", error);
    }
  };

  // Auto-track abandonment on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackFormAbandonment();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      trackFormAbandonment();
    };
  }, [trackFormAbandonment]);

  // Initialize if formId and formName provided
  useEffect(() => {
    if (formId && formName) {
      initFormTracking(formId, formName);
    }
  }, [formId, formName, initFormTracking]);

  return {
    initFormTracking,
    trackFieldFocus,
    trackFieldBlur,
    trackFieldError,
    trackFormSubmit,
    trackFormAbandonment,
    getFormAnalytics: () => currentFormRef.current,
  };
};
