import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";

export default function Monuments() {
  const monuments = [
    {
      name: "Taj Mahal",
      slug: "taj-mahal",
      state: "Uttar Pradesh",
      image: "/images/tajmahal.png",
      description:
        "An iconic symbol of love and one of India's most celebrated monuments.",
    },
    {
      name: "Hawa Mahal",
      slug: "hawa-mahal",
      state: "Rajasthan",
      image: "/images/hawamahal.png",
      description:
        "Jaipur's famous Palace of Winds, known for its distinctive pink facade.",
    },
    {
      name: "Victoria Memorial",
      slug: "victoria-memorial",
      state: "West Bengal",
      image: "/images/victoria.png",
      description:
        "A magnificent marble landmark surrounded by gardens in the heart of Kolkata.",
    },
    {
      name: "Konark Sun Temple",
      slug: "konark-sun-temple",
      state: "Odisha",
      image: "/images/konark.png",
      description:
        "A remarkable temple complex celebrated for its stone architecture and carvings.",
    },
    {
      name: "Sanchi Stupa",
      slug: "sanchi-stupa",
      state: "Madhya Pradesh",
      image: "/images/sanchi.png",
      description:
        "One of India's oldest surviving Buddhist monuments.",
    },
    {
      name: "Charminar",
      slug: "charminar",
      state: "Telangana",
      image: "/images/charminar.png",
      description:
        "Hyderabad's iconic four-minaret monument and enduring city landmark.",
    },
  ];

  return (
    <section className="section page">

      <Link to="/heritage" className="backLink">
        ← Back to Heritage
      </Link>

      <SectionHeading
        eyebrow="INDIAN MONUMENTS"
        title="Stories carved in stone."
        text="Explore remarkable monuments across India and discover the stories behind their architecture."
      />

      <div className="monumentGrid">

        {monuments.map((monument) => (
          <article
            className="monumentCard"
            key={monument.name}
          >

            {/* =================================================
                CLICKABLE PHOTO ONLY
            ================================================= */}

            <Link
              to={`/heritage/monuments/${monument.slug}`}
              className="monumentImageLink"
            >
              <img
                src={monument.image}
                alt={monument.name}
              />
            </Link>


            {/* =================================================
                NORMAL CONTENT — NOT CLICKABLE
            ================================================= */}

            <div className="monumentInfo">

              <small>
                📍 {monument.state}
              </small>

              <h3>
                {monument.name}
              </h3>

              <p>
                {monument.description}
              </p>


              {/* =================================================
                  CLICKABLE EXPLORE STORY BUTTON
              ================================================= */}

              <Link
                to={`/heritage/monuments/${monument.slug}`}
                className="secondary"
              >
                Explore Story →
              </Link>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}