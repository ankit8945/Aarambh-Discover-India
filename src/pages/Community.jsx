import { useState } from "react";
import { Heart, Share2, Sparkles, Upload } from "lucide-react";

const initialPosts = [
  { name: "Sunrise at the Taj", user: "@aanya.travels", image: "/images/tajmahal.png", text: "The marble changes character every few minutes." },
  { name: "Old lanes of Kashi", user: "@rohanexplores", image: "/images/kashi.png", text: "Found a tiny weaving workshop hidden behind the market." },
  { name: "Colours of Mithila", user: "@meghna", image: "/images/crafts/folk-art/madhubani.png", text: "Met an artist and learned why every border matters." },
  { name: "A royal evening", user: "@travellerdiary", image: "/images/mysore.png", text: "A palace, a story and a city that still feels royal." },
];

export default function Community() {
  const [posts, setPosts] = useState(initialPosts);
  const [liked, setLiked] = useState({});

  const addDiscovery = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPosts((prev) => [
      { name: "My discovery", user: "@you", image: URL.createObjectURL(file), text: "A place worth remembering." },
      ...prev,
    ]);
  };

  return (
    <main className="living-page community-page">
      <section className="living-hero community-hero">
        <div className="living-hero-copy">
          <span className="living-kicker"><Sparkles size={15} /> COMMUNITY OF EXPLORERS</span>
          <h1>See India through<br /><em>other people's eyes.</em></h1>
          <p>Share photographs, discoveries and small cultural moments that deserve to be remembered.</p>
          <label className="upload-discovery community-upload"><Upload size={18} /> Share your discovery<input type="file" accept="image/*" onChange={addDiscovery} /></label>
        </div>
        <div className="living-hero-art">
          <img src="/images/crafts/folk-art/madhubani.png" alt="Community discovery" />
          <div className="hero-art-card"><span>{posts.length}</span><div><small>SHARED NOW</small><strong>Discoveries from travellers</strong></div></div>
        </div>
      </section>

      <section className="living-section">
        <div className="living-heading">
          <div><span>01 · COMMUNITY OF EXPLORERS</span><h2>Small moments. Big stories.</h2></div>
          <p>Travellers can share what they noticed, learned and experienced while exploring India's living heritage.</p>
        </div>
        <div className="discovery-grid community-discovery-grid">
          {posts.map((post, index) => (
            <article className="discovery-card" key={`${post.name}-${index}`}>
              <img src={post.image} alt={post.name} />
              <div className="discovery-overlay">
                <div><span>{post.user}</span><h3>{post.name}</h3><p>{post.text}</p></div>
                <div className="discovery-actions">
                  <button onClick={() => setLiked((prev) => ({ ...prev, [index]: !prev[index] }))} className={liked[index] ? "liked" : ""}><Heart size={17} fill={liked[index] ? "currentColor" : "none"} /></button>
                  <button><Share2 size={17} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
