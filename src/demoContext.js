/**
 * This context is to help enable demo-only features such as dummy data, bypass authentication, etc.
 * I do this so I can easily provide a working demo for my portfolio for viewers that dont have a Bungie / Destiny2 account.
 */

import {createContext} from "react";

export const DemoContext = createContext(false);
