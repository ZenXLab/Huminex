import { TraceflowGuard } from "@/components/guards/TraceflowGuard";
import { TraceflowDashboardFull } from "@/components/traceflow/TraceflowDashboardFull";

const TraceflowDashboardPage = () => {
  return (
    <TraceflowGuard>
      <TraceflowDashboardFull />
    </TraceflowGuard>
  );
};

export default TraceflowDashboardPage;
