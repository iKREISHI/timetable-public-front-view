import sanitizedConfig from "@/modules/config/config";

export default function Home() {
  return (
  <div className={'container-xxl'}>
    <p>
      URL_API: {sanitizedConfig.URL_API} <br/>
      PORT: {sanitizedConfig.PORT} <br/>
    </p>
  </div>
  )
}
