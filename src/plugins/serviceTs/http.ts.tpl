<%= InterfaceDefinition %>

/**
 * @tags <%= FunctionTags %>
 * @summary <%= FunctionSummary %>
 * @description <%= FunctionDescription %>
 * @param params <%= FunctionParams %>
 */
export async function <%= FunctionName %>(params?: <%= FunctionParams %>): Promise<<%= FunctionPromise %>> {
    return request(<%= FunctionUrl %>, <%= FunctionParamsMethod %>);
}
