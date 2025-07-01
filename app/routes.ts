import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test-property/:id", "routes/test-property.$id.tsx"),
] satisfies RouteConfig;
