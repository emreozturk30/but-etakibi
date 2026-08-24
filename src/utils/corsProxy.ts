const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url='

// Bigpara (Hürriyet) API'si Access-Control-Allow-Origin başlığı göndermiyor,
// bu yüzden tarayıcıdan doğrudan fetch() ile erişilemiyor (CORS engeli).
// Bu, isteği bir CORS proxy üzerinden yönlendirip yanıtı izinli başlıklarla
// geri döndürüyor.
export function withCorsProxy(url: string): string {
  return `${CORS_PROXY_URL}${encodeURIComponent(url)}`
}
