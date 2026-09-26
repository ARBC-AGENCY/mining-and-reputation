"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register once, here. Importing gsap directly elsewhere risks using
// ScrollTrigger before it has been registered.
// As of GSAP 3.13 the whole plugin set (ScrollTrigger, SplitText) is free.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, useGSAP, ScrollTrigger, SplitText };
