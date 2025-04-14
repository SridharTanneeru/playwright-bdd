import  dotenv  from "dotenv";

async function globalSetup(): Promise<void> {
    try {
        // const envFilePath = process.env.ENV? `.env.${process.env.ENV}`: ".env";
        const envFilePath = ".env";
        dotenv.config({
            path: envFilePath,
            override: true
            
        })
    } catch (error) {
        console.error("Error in loading env variables", error)
    }
}

export default globalSetup;