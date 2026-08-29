"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, here. Importing gsap directly elsewhere risks using
// ScrollTrigger before it has been registered.
// As of GSAP 3.13 the whole plugin set (ScrollTrigger included) is free.
gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, useGSAP, ScrollTrigger };
