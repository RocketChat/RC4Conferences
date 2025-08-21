import { fetchAPI, getStrapiURL } from "./api";
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

// Hook version for client-side components
export function useFormData (formId) {
  const path = getStrapiURL(`/forms/${formId}`)
  const { data, error } = useSWR(`${path}`, fetcher)

  return {
    form: data,
    isLoading: !error && !data,
    isError: error
  }
}

// Server-side version for SSR/SSG
export async function getFormData (formId) {
  try {
    const path = getStrapiURL(`/forms/${formId}`)
    const response = await fetch(path)
    const data = await response.json()
    
    return {
      form: data,
      isLoading: false,
      isError: !response.ok
    }
  } catch (error) {
    return {
      form: null,
      isLoading: false,
      isError: true
    }
  }
}

export const getForms = async () => {
  const res = await fetchAPI(`/forms`);
  return res;
};
