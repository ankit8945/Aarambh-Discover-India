import { Link, useParams } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";

const cultureCategories = {
  festivals: {
    eyebrow: "INDIA'S FESTIVALS",
    title: "Celebrations that bring communities together.",
    text:
      "Explore India's vibrant festivals, colourful celebrations and traditions passed through generations.",

    items: [
      {
        name: "Holi",
        slug: "holi",
        region: "North India",
        image: "/images/culture/festivals & celebrations/holi.jpeg",
        description:
          "The festival of colours celebrated with music, joy, food and communities coming together.",
      },
      {
        name: "Diwali",
        slug: "diwali",
        region: "Pan India",
        image: "/images/culture/festivals & celebrations/diwali.jpeg",
        description:
          "The festival of lights celebrated with lamps, prayers, sweets and family gatherings.",
      },
      {
        name: "Durga Puja",
        slug: "durga-puja",
        region: "West Bengal",
        image: "/images/culture/festivals & celebrations/durga.jpeg",
        description:
          "A grand cultural celebration featuring artistic pandals, music, rituals and community gatherings.",
      },
      {
        name: "Onam",
        slug: "onam",
        region: "Kerala",
        image: "/images/culture/festivals & celebrations/onam.jpeg",
        description:
          "Kerala's harvest festival known for floral designs, traditional celebrations and Onam Sadya.",
      },
      {
        name: "Pongal",
        slug: "pongal",
        region: "Tamil Nadu",
        image: "/images/culture/festivals & celebrations/pongal.jpeg",
        description:
          "A harvest celebration honouring nature, agriculture, prosperity and family traditions.",
      },
      {
        name: "Bihu",
        slug: "bihu",
        region: "Assam",
        image: "/images/culture/festivals & celebrations/bihu.jpeg",
        description:
          "An Assamese festival connected with agriculture, traditional music, dance and community celebrations.",
      },
    ],
  },

  "dance-music": {
    eyebrow: "INDIAN DANCE & MUSIC",
    title: "Stories told through rhythm and expression.",
    text:
      "Discover India's classical and folk dance and music traditions.",

    items: [
      {
        name: "Bharatanatyam",
        slug: "bharatanatyam",
        region: "Tamil Nadu",
        image: "/images/culture/dance & music/bharatnatyam.jpeg",
        description:
          "A classical dance tradition known for precise movements and expressive storytelling.",
      },
      {
        name: "Kathak",
        slug: "kathak",
        region: "North India",
        image: "/images/culture/dance & music/kathak.jpeg",
        description:
          "A classical dance tradition known for intricate footwork, spins and storytelling.",
      },
      {
        name: "Kathakali",
        slug: "kathakali",
        region: "Kerala",
        image: "/images/culture/dance & music/kathakali.jpeg",
        description:
          "A dramatic dance tradition recognised for elaborate costumes, makeup and expressive performance.",
      },
      {
        name: "Hindustani Music",
        slug: "hindustani-music",
        region: "North India",
        image: "/images/culture/dance & music/hindustani.jpeg",
        description:
          "A classical musical tradition built around ragas, rhythm and improvisation.",
      },
      {
        name: "Carnatic Music",
        slug: "carnatic-music",
        region: "South India",
        image: "/images/culture/dance & music/carnatic.jpeg",
        description:
          "The classical music tradition of South India known for complex compositions and rhythms.",
      },
      {
        name: "Bihu Dance",
        slug: "bihu-dance",
        region: "Assam",
        image: "/images/culture/dance & music/bihu.jpeg",
        description:
          "An energetic Assamese folk dance traditionally associated with Bihu celebrations.",
      },
    ],
  },

  clothing: {
    eyebrow: "INDIAN TEXTILES & CLOTHING",
    title: "Threads that carry stories of India's regions.",
    text:
      "Explore India's traditional clothing, textiles and weaving traditions.",

    items: [
      {
        name: "Banarasi Silk",
        slug: "banarasi-silk",
        region: "Uttar Pradesh",
        image: "/images/culture/clothing/banarasi.jpeg",
        description:
          "Luxurious silk textiles from Varanasi known for intricate weaving and rich designs.",
      },
      {
        name: "Kanchipuram Silk",
        slug: "kanchipuram-silk",
        region: "Tamil Nadu",
        image: "/images/culture/clothing/kanchipuram.jpeg",
        description:
          "Traditional silk sarees recognised for rich colours and detailed borders.",
      },
      {
        name: "Phulkari",
        slug: "phulkari",
        region: "Punjab",
        image: "/images/culture/clothing/phulkari.jpeg",
        description:
          "A colourful embroidery tradition featuring intricate floral patterns.",
      },
      {
        name: "Bandhani",
        slug: "bandhani",
        region: "Rajasthan & Gujarat",
        image: "/images/culture/clothing/bandhani.jpeg",
        description:
          "A traditional tie-and-dye textile technique creating distinctive patterns.",
      },
      {
        name: "Kasavu",
        slug: "kasavu",
        region: "Kerala",
        image: "/images/culture/clothing/kasavu.jpeg",
        description:
          "Kerala's traditional textile style often recognised by its elegant gold border.",
      },
      {
        name: "Pashmina",
        slug: "pashmina",
        region: "Kashmir",
        image: "/images/culture/clothing/paschmina.jpeg",
        description:
          "A fine wool textile tradition known for softness and detailed craftsmanship.",
      },
    ],
  },

  "art-storytelling": {
    eyebrow: "INDIAN ART & STORYTELLING",
    title: "Artistic traditions shaped by generations.",
    text:
      "Discover India's folk paintings, crafts and storytelling traditions.",

    items: [
      {
        name: "Madhubani",
        slug: "madhubani",
        region: "Bihar",
        image: "/images/culture/art-storytelling/madhubani.png",
        description:
          "A distinctive painting tradition known for bold patterns, natural themes and storytelling.",
      },
      {
        name: "Warli",
        slug: "warli",
        region: "Maharashtra",
        image: "/images/culture/art-storytelling/warli.png",
        description:
          "A tribal painting tradition characterised by simple geometric human and animal figures.",
      },
      {
        name: "Pattachitra",
        slug: "pattachitra",
        region: "Odisha",
        image: "/images/culture/art-storytelling/pattachitra.png",
        description:
          "A traditional painting style known for detailed compositions and mythological themes.",
      },
      {
        name: "Kalamkari",
        slug: "kalamkari",
        region: "South India",
        image: "/images/culture/art-storytelling/kalamkari.png",
        description:
          "A textile and painting tradition featuring hand-drawn and naturally dyed designs.",
      },
      {
        name: "Blue Pottery",
        slug: "blue-pottery",
        region: "Rajasthan",
        image: "/images/culture/art-storytelling/blue-pottery.png",
        description:
          "A decorative craft associated with Jaipur and known for colourful glazed designs.",
      },
      {
        name: "Dhokra",
        slug: "dhokra",
        region: "Central & Eastern India",
        image: "/images/culture/art-storytelling/dhokra.png",
        description:
          "An ancient metal-casting tradition using the lost-wax technique.",
      },
    ],
  },

  "traditions-lifestyle": {
    eyebrow: "LIVING INDIA",
    title: "The everyday traditions that make India unique.",
    text:
      "Discover the customs, communities and ways of life that shape India's cultural identity.",

    items: [
      {
        name: "Family Traditions",
        slug: "family-traditions",
        region: "Pan India",
        image: "/images/culture/traditions-lifestyle/family.png",
        description:
          "Family gatherings, ceremonies, weddings and rituals remain an important part of Indian social life.",
      },
      {
        name: "Village Life",
        slug: "village-life",
        region: "Rural India",
        image: "/images/culture/traditions-lifestyle/village.png",
        description:
          "Traditional communities continue to preserve agricultural practices, crafts and local customs.",
      },
      {
        name: "Spiritual Traditions",
        slug: "spiritual-traditions",
        region: "Pan India",
        image: "/images/culture/traditions-lifestyle/spiritual.png",
        description:
          "Pilgrimage, prayer, meditation and community rituals form an important part of life.",
      },
      {
        name: "Local Markets",
        slug: "local-markets",
        region: "Pan India",
        image: "/images/culture/traditions-lifestyle/markets.png",
        description:
          "Traditional bazaars bring together food, textiles, crafts, spices and community life.",
      },
      {
        name: "Indian Hospitality",
        slug: "hospitality",
        region: "Pan India",
        image: "/images/culture/traditions-lifestyle/hospitality.png",
        description:
          "Welcoming guests and sharing food are deeply valued traditions across Indian communities.",
      },
      {
        name: "Regional Identity",
        slug: "regional-identity",
        region: "Across India",
        image: "/images/culture/traditions-lifestyle/regional.png",
        description:
          "Language, clothing, cuisine and customs create distinctive identities across India's regions.",
      },
    ],
  },

  "languages-literature": {
    eyebrow: "INDIAN LANGUAGES & LITERATURE",
    title: "Many languages, countless stories.",
    text:
      "Discover India's linguistic diversity, literature, poetry and storytelling traditions.",

    items: [
      {
        name: "Hindi Literature",
        slug: "hindi-literature",
        region: "North & Central India",
        image: "/images/culture/languages-literature/hindi.png",
        description:
          "A rich literary tradition spanning poetry, novels, stories and regional voices.",
      },
      {
        name: "Bengali Literature",
        slug: "bengali-literature",
        region: "West Bengal",
        image: "/images/culture/languages-literature/bengali.png",
        description:
          "A celebrated literary tradition known for poetry, novels, theatre and intellectual writing.",
      },
      {
        name: "Tamil Literature",
        slug: "tamil-literature",
        region: "Tamil Nadu",
        image: "/images/culture/languages-literature/tamil.png",
        description:
          "One of India's oldest literary traditions with a long history of poetry and classical works.",
      },
      {
        name: "Sanskrit Literature",
        slug: "sanskrit-literature",
        region: "Pan India",
        image: "/images/culture/languages-literature/sanskrit.png",
        description:
          "An ancient literary tradition containing philosophical, poetic and scholarly works.",
      },
      {
        name: "Urdu Poetry",
        slug: "urdu-poetry",
        region: "North India",
        image: "/images/culture/languages-literature/urdu.png",
        description:
          "A poetic tradition celebrated for its expressive language, ghazals and literary culture.",
      },
      {
        name: "Folk Storytelling",
        slug: "folk-storytelling",
        region: "Across India",
        image: "/images/culture/languages-literature/folk.png",
        description:
          "Oral storytelling traditions preserve local legends, myths, values and community memories.",
      },
    ],
  },
};

export default function CultureDetail() {
  const { slug } = useParams();

  const category = cultureCategories[slug];

  if (!category) {
    return (
      <section className="section center">
        <h1>Culture category not found.</h1>

        <p>
          We couldn't find the culture category you're looking for.
        </p>

        <Link to="/culture" className="secondary">
          ← Back to Culture
        </Link>
      </section>
    );
  }

  return (
    <section className="section page">

      <Link to="/culture" className="backLink">
        ← Back to Culture
      </Link>

      <SectionHeading
        eyebrow={category.eyebrow}
        title={category.title}
        text={category.text}
      />

      <div className="monumentGrid">

        {category.items.map((item) => {
          const storyPath = `/culture/${slug}/${item.slug}`;

          return (
            <article
              className="monumentCard"
              key={item.slug}
            >

              {/* ONLY IMAGE IS CLICKABLE */}
              <Link
                to={storyPath}
                className="monumentImageLink"
                aria-label={`Explore ${item.name}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />
              </Link>

              <div className="monumentInfo">

                <small>
                  📍 {item.region}
                </small>

                <h3>
                  {item.name}
                </h3>

                <p>
                  {item.description}
                </p>

                {/* ONLY BUTTON IS CLICKABLE */}
                <Link
                  to={storyPath}
                  className="secondary"
                >
                  Explore Story →
                </Link>

              </div>

            </article>
          );
        })}

      </div>

    </section>
  );
}