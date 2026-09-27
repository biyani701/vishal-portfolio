// CopilotKit's runtime sends usage telemetry unless this is set, and reads it once when its module loads, so the
// entry imports this file before anything that imports the runtime. Visitors' questions go only to the model
// provider the privacy policy names.
process.env.COPILOTKIT_TELEMETRY_DISABLED = 'true'
