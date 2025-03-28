import {
  IconAlignBoxBottomCenter,
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconTicket,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Stats Page",
    icon: IconAlignBoxBottomCenter,
    href: "/stats",

  },
  {
    id: uniqueId(),
    title: "Submit A Ticket",
    icon: IconTicket,
    href: "/ticket",
  },

  {
    navlabel: true,
    subheader: "Auth",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/authentication/login",
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/authentication/register",
  },

];

export default Menuitems;
