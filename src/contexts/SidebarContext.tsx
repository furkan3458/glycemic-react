import React from "react";

export interface SidebarContextProvider{
    handleSidebar:Function;
}

const initialize:SidebarContextProvider = {
    handleSidebar:()=>{}
}

const SidebarContext = React.createContext(initialize);

export default SidebarContext;