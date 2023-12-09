import {createEnv} from '@t3-oss/env-core'
import {z} from 'zod'


export const env = createEnv({
    clientPrefix: 'PUBLIC_',
    server: {},
    runtimeEnv: import.meta.env,
    client: {
        PUBLIC_API_URL: z.string().default('http://localhost:8000'),
    },
})
