import "../styles/about.css"

function AboutPage() {

    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-content">
                    <span className="abour-label">Our Story</span>

                    <h1>Handmade Judaica, Created with Meaning</h1>

                    <p>
                        Olive Art Creations is a small family business born from a love of
                        craftsmanship, tradition, and creativity.
                    </p>
                </div>
            </section>

            <section className="about-story">
                <div className="about-story-card">
                    <h2>From Years of Craftsmanship to a New Creative Journey</h2>

                    <p>
                        After more than 30 years of hands-on work, I retired and began
                        looking for a meaningful way to fill the new time in my life.
                        Through a relative who worked with olive wood and epoxy resin, I
                        discovered a craft that immediately captured my interest.
                    </p>

                    <p>
                        What began as curiosity slowly became a passion. Over time, I
                        continued learning, experimenting, and improving both the creative
                        and technical sides of the work.
                    </p>
                </div>

                <div className="about-family-card">
                    <h2>A Family Business</h2>

                    <p>
                        Olive Art Creations is truly a family effort. I create each product
                        by hand, while my daughter Yael manages the digital side of the
                        business, including the website, technology, and online presence.
                    </p>

                    <p>
                        Together, we combine traditional craftsmanship with modern tools to
                        create meaningful products that are personal, unique, and made with
                        care.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default AboutPage