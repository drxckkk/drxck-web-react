import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

/* react-router v7 pulls in TextEncoder/TextDecoder, which the jsdom build
   bundled with CRA 5 doesn't expose. Polyfilled here so routed components can
   be imported in tests at all. */
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;
