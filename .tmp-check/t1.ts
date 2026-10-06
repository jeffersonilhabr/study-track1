import type { ErrorRouteComponent } from "@tanstack/react-router";
function A({ error, reset }: { error: Error; reset: () => void }) { return null; }
const B: ErrorRouteComponent = ({ error, reset }) => { console.log(error, reset); return null; };
