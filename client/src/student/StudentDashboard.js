import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [scholarships, setScholarships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Fetch scholarships on mount
  useEffect(() => {
    fetchScholarships();
  }, []);

  // Apply search filtering
  useEffect(() => {
    applyFilters();
  }, [scholarships, search]);

  const fetchScholarships = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3500/student/getallscholarships");
      if (Array.isArray(res.data)) {
        setScholarships(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setScholarships(res.data.data);
      } else {
        const foundArray = Object.values(res.data || {}).find((v) => Array.isArray(v));
        setScholarships(foundArray || []);
      }
    } catch (err) {
      console.error("Error fetching scholarships:", err);
      const msg = err?.response?.data?.message || err?.response?.data?.error;
      setError(msg || "Unable to fetch scholarships.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const q = search.trim().toLowerCase();
    if (!q) return setFiltered(scholarships);
    setFiltered(
      scholarships.filter((s) => {
        const name = (s.scholarshipName || s.name || "").toLowerCase();
        const provider = (s.providerName || "").toLowerCase();
        return name.includes(q) || provider.includes(q);
      })
    );
  };

  const prettyDate = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  // ✨ Background particle animation
  useEffect(() => {
    const canvas = document.getElementById("student-bg");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const NUM = 70;
    let rafId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 2 + 0.6;
        this.vx = (Math.random() - 0.5) * 1.1;
        this.vy = (Math.random() - 0.5) * 1.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = "#00eaff";
        ctx.fill();
      }
    }

    particles = Array.from({ length: NUM }, () => new Particle());

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = "rgba(0,210,255,0.14)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connect();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <style>{`
        .student-root {
          position: relative;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at center, #001a35, #000817);
          color: #fff;
          padding: 34px 18px;
          box-sizing: border-box;
          overflow: hidden;
        }

        #student-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
        }

        .wrap {
          position: relative;
          z-index: 1;
          width: 1100px;
          max-width: calc(100% - 40px);
          margin: 0 auto;
        }

        .head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(90deg,#00cfff,#ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .search {
          min-width: 250px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          outline: none;
        }

        .search::placeholder { color: #bfeff7; }

        .container {
          padding: 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          margin-top: 14px;
        }

        .card {
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00));
          border: 1px solid rgba(0,207,255,0.08);
          box-shadow: 0 6px 18px rgba(0,0,0,0.45);
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 130px;
        }

        .card h3 {
          margin: 0;
          font-size: 17px;
          color: #e7ffff;
        }

        .metaSmall { font-size: 13px; color: #9fdff6; }
        .desc { color: #bfeff7; font-size: 13px; margin-top: 6px; }
        .empty { text-align: center; padding: 40px 0; color: #a9dfe8; }

        @media (max-width: 680px) {
          .wrap { width: 96%; }
          .head { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="student-root">
        <canvas id="student-bg"></canvas>

        <div className="wrap">
          <div className="head">
            <div className="title">Student Scholarship Dashboard</div>
            <input
              className="search"
              placeholder="Search scholarship or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="container">
            {loading ? (
              <div className="empty">Loading scholarships...</div>
            ) : error ? (
              <div className="empty">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="empty">No scholarships found.</div>
            ) : (
              <div className="grid">
                {filtered.map((it) => (
                  <div className="card" key={it._id || it.id || Math.random()}>
                    <h3>{it.scholarshipName || it.name || "Untitled Scholarship"}</h3>

                    <div className="metaSmall">
                      <b>Provider:</b> {it.providerName || "Unknown"}
                    </div>

                    <div className="metaSmall">
                      <b>Amount:</b> ₹ {it.scholarshipAmount ?? it.amount ?? "-"}
                    </div>

                    <div className="metaSmall">
                      <b>Deadline:</b> {prettyDate(it.applicationDeadline)}
                    </div>

                    <div className="desc">
                      {(it.description || it.eligibilityCriteria || "No description available.").slice(0, 200)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
