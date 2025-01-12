import { CohereClientV2 } from "cohere-ai";
import axios from "axios";

type Submission = {
  problem: string
  latitude: string
  longitude: string
  error?: string
}

type ProblemResponse = {
  subject: string
  body: string
  error?: string
}

type Business = {
  address: string
  name: string
  email: string
  error?: string
}

const cohere = new CohereClientV2({
  token: process.env.NEXT_PUBLIC_COHERE_CLIENT_API
})

export async function processSubmission({problem, latitude, longitude}: Submission): Promise<ProblemResponse> {
  const addressRes = await getAddressData(latitude, longitude)
  if (addressRes.error) {
    console.error(addressRes.error)
    return { subject: "ERROR", body: "An unexpected error occured while trying to get the address" }
  }
  const businessRes = await getBusinessData(addressRes.address as string)
  if (businessRes.error) {
    console.error(businessRes.error)
    return { subject: "ERROR", body: "An unexpected error occured while trying to get the business data" }
  }
  const email = await getEmailData(problem, businessRes, latitude, longitude)

  return email
}

async function getAddressData(latitude: string, longitude: string): Promise<{ address?: string, error?: string }> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_API}`
  try {
    const response = await axios.get(url)
    const results = response.data.results;
    
    if (results.length > 0) {
      for (const result of results) {
        const types = result.types;

        if (!types.includes("transit_station")) {
          console.log(result)
          return { address: result.vicinity }
        }
      }
    }

    return { error: "No businesses found nearby" }
  } catch (error) {
    console.error("Error fetching data from Google Geocode API: ", error)
    return { error: "An error occured while fetching the address" }
  }
}

async function getBusinessData(address: string): Promise<Business> {
  const payloadName = {
    model: "llama-3.1-sonar-large-128k-online",
    return_images: false,
    return_related_questions: false,
    stream: false,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: `Please give me a string with JUST the name of the business currently located at the given address in the response to this input without citations: ${address}`
      }
    ],
  };

  const payloadEmail = {
    model: "llama-3.1-sonar-large-128k-online",
    return_images: false,
    return_related_questions: false,
    stream: false,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: `Please give me a string with JUST the email of the business currently located at the given address in the response to this input without citations: ${address}`
      }
    ],
  };

  const headers = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_CLIENT_API}`,
    'Content-Type': 'application/json',
  };

  try {
    // const responseName = await axios.post("https://api.perplexity.ai/chat/completions", payloadName, { headers })
    // const responseEmail = await axios.post("https://api.perplexity.ai/chat/completions", payloadEmail, { headers })
    // console.log(responseName)
    // console.log(responseEmail)

    // const businessName = responseName?.data?.choices?.[0]?.message?.content || "No business name found"
    // const businessEmail = responseEmail?.data?.choices?.[0]?.message?.content || "No business email found"
    
    return { 
      name: "Example Business",
      address: address,
      email: "example@domain.xyz"
    }
  } catch (error) {
    console.error("Failed to get the business data", error)
    return { 
      name: "Error",
      address: "Error",
      email: "Error",
      error: "Failed to get the business data" }
  }  
}

async function getEmailData(problem: string, {address, name, email}: Business, latitude: string, longitude: string) {
  console.log({
    problem,
    address,
    name,
    email,
    latitude,
    longitude
  })
  const emailData = await cohere.chat({
    model: 'command-r-plus',
    messages: [
      {
        role: 'system',
        content: 'You are the backend for RapidReport, a webapp that helps people report accessibility problems with ease using AI and location data to make reporting these problems as easy as possible. Using the complaint given by the user, create seperately BODY AND SUBJECT LINE of an email from our business addressed to the relevant parties email address to fix the issue. Please speak on behalf of the company RapidReport and make the email ready to send without any further modification. DO NOT INCLUDE ANY special characters, DO NOT INDLUE ANY new line characters in the body of the email, or DO NOT INCLUDE ANY square brackets in the body of the email. Before giving me the body section take out any newline characters and replace them with enters.'
      },
      {
        role: 'user',
        content: `${problem}. ${name} ${address}, ${email} ${latitude} ${longitude}`
      }
    ],
    responseFormat: {
      type: "json_object",
      jsonSchema: {
        "type": "object",
        "properties": {
          "body": {
            "type": "string"
          },
          "subject": {
            "type": "string"
          }
        },
        "required": ["body", "subject"]
      }
    }
  })
  
  console.log(emailData)
  const emailJSON = JSON.parse(emailData.message?.content?.[0]?.text ?? '')
  const parsedEmailJSON = {
    subject: emailJSON.subject,
    body: emailJSON.body
      .replace(/\\n/g, '\n')
      .replace(/\\./g, '')
      .replace(/\\\\/g, '\\')
  }
  return parsedEmailJSON as ProblemResponse
}
