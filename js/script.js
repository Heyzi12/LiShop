const SUPABASE_URL = "https://jawuclncecixexesrenf.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_VwrTf8Oax-8jhfcFZS_-1w_A0feposW"

async function fetchData(){
    const responce = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Autorization": `Bearer ${SUPABASE_ANON_KEY}`,
        }
    });
    const data = responce.json();
    console.log(data)
    return data
}

fetchData()