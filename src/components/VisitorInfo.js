import { useEffect, useState } from 'react';

function VisitorInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch('https://ipinfo.io/json?token=1b4df53e065721')
      .then(res => res.json())
      .then(data => setInfo(data));
  }, []);

  if (!info) return <p>Loading visitor info...</p>;

  return (
    <div>
      <p>IP: {info.ip}</p>
      <p>City: {info.city}</p>
      <p>Region: {info.region}</p>
      <p>Country: {info.country}</p>
      <p>ISP: {info.org}</p>
    </div>
  );
}

export default VisitorInfo;
