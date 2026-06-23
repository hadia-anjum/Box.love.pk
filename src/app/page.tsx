"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Prices Configuration
const PRICES = {
  box: 1600,
  top: 300,
  inside: 300,
  banner: 350,
  fairy: 300,
  ribbon: 100,
  delivery: 400,
};

interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  postal: string;
  country: string;
  boxType: string;
  inkColor: string;
  topText: string;
  insideText: string;
  bannerText: string;
  addons: string;
  total: string;
}

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [orderType, setOrderType] = useState<"simple" | "custom">("custom");
  const [inkColor, setInkColor] = useState<"gold" | "silver">("gold");
  const [hasTopMsg, setHasTopMsg] = useState(false);
  const [hasInsideMsg, setHasInsideMsg] = useState(false);
  const [hasBanner, setHasBanner] = useState(false);
  const [topText, setTopText] = useState("");
  const [insideText, setInsideText] = useState("");
  const [bannerText, setBannerText] = useState("");
  const [addons, setAddons] = useState({ fairy: false, ribbon: false });

  // Preview tab state
  const [previewTab, setPreviewTab] = useState<"top" | "inside">("top");

  // Nav scroll state
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "confirmation">("form");

  // Checkout form inputs
  const [formInputs, setFormInputs] = useState({
    email: "",
    fname: "",
    lname: "",
    address: "",
    apartment: "",
    city: "",
    postal: "",
    phone: "",
    country: "Pakistan",
    newsletter: true,
    saveInfo: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavedMsgTop, setIsSavedMsgTop] = useState(false);
  const [isSavedMsgInside, setIsSavedMsgInside] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Particle effect array
  const [particles, setParticles] = useState<
    Array<{ id: number; left: string; size: string; dur: string; delay: string }>
  >([]);

  // DOM references
  const insideTextareaRef = useRef<HTMLTextAreaElement>(null);
  const topTextareaRef = useRef<HTMLTextAreaElement>(null);

  // --- PERSISTENCE & BOOTSTRAP ---
  useEffect(() => {
    // Generate particles
    const generated = Array.from({ length: 15 }).map((_, idx) => ({
      id: idx,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 4}px`,
      dur: `${Math.random() * 12 + 8}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setParticles(generated);

    // Scroll listener for sticky nav
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Load saved checkout details
    const savedDetails = localStorage.getItem("saved_checkout_details");
    if (savedDetails) {
      try {
        const parsed = JSON.parse(savedDetails);
        setFormInputs((prev) => ({
          ...prev,
          ...parsed,
        }));
      } catch (e) {
        console.error("Error loading checkout details", e);
      }
    }

    // Load saved messages
    const savedTop = localStorage.getItem("saved_top");
    const savedInside = localStorage.getItem("saved_inside");
    if (savedTop) {
      setTopText(savedTop);
      setHasTopMsg(true);
    }
    if (savedInside) {
      setInsideText(savedInside);
      setHasInsideMsg(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- CALCULATION LOGIC ---
  const calculateTotal = () => {
    let total = PRICES.box + PRICES.delivery;
    if (orderType === "custom") {
      if (hasTopMsg) total += PRICES.top;
      if (hasInsideMsg) total += PRICES.inside;
    }
    if (hasBanner) total += PRICES.banner;
    if (addons.fairy) total += PRICES.fairy;
    if (addons.ribbon) total += PRICES.ribbon;
    return total;
  };

  // Auto-switch tabs based on user input
  const handleTopTextInput = (val: string) => {
    setTopText(val);
    if (previewTab !== "top") setPreviewTab("top");
  };

  const handleInsideTextInput = (val: string) => {
    setInsideText(val);
    if (previewTab !== "inside") setPreviewTab("inside");
  };

  // Toggle Top Message Checkbox
  const toggleTopMsg = () => {
    const nextVal = !hasTopMsg;
    setHasTopMsg(nextVal);
    if (nextVal) {
      setTimeout(() => topTextareaRef.current?.focus(), 100);
      setPreviewTab("top");
    } else {
      setTopText("");
      localStorage.removeItem("saved_top");
    }
  };

  // Toggle Inside Message Checkbox
  const toggleInsideMsg = () => {
    const nextVal = !hasInsideMsg;
    setHasInsideMsg(nextVal);
    if (nextVal) {
      setTimeout(() => insideTextareaRef.current?.focus(), 100);
      setPreviewTab("inside");
    } else {
      setInsideText("");
      localStorage.removeItem("saved_inside");
    }
  };

  // Save text to LocalStorage
  const handleSaveText = (type: "top" | "inside") => {
    if (type === "top") {
      localStorage.setItem("saved_top", topText);
      setIsSavedMsgTop(true);
      setTimeout(() => setIsSavedMsgTop(false), 2000);
    } else {
      localStorage.setItem("saved_inside", insideText);
      setIsSavedMsgInside(true);
      setTimeout(() => setIsSavedMsgInside(false), 2000);
    }
  };

  // --- TILT EFFECT FOR CARDS ---
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const ry = x * 12; // max 12 deg
    const rx = -y * 10; // max 10 deg
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.015, 1.015, 1.015)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };

  // --- SUBMIT CHECKOUT FORM ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    const key = id.replace("chk-", "");
    const finalVal =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormInputs((prev) => ({
      ...prev,
      [key]: finalVal,
    }));
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formInputs.email ||
      !formInputs.lname ||
      !formInputs.address ||
      !formInputs.city ||
      !formInputs.phone
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    if (formInputs.saveInfo) {
      localStorage.setItem(
        "saved_checkout_details",
        JSON.stringify({
          email: formInputs.email,
          fname: formInputs.fname,
          lname: formInputs.lname,
          address: formInputs.address,
          apartment: formInputs.apartment,
          city: formInputs.city,
          postal: formInputs.postal,
          phone: formInputs.phone,
          country: formInputs.country,
        })
      );
    } else {
      localStorage.removeItem("saved_checkout_details");
    }

    const orderTotal = calculateTotal();
    const addonsList: string[] = [];
    if (addons.fairy) addonsList.push("Fairy Lights");
    if (addons.ribbon) addonsList.push("Ribbon Bow");

    const orderData: OrderData = {
      name: `${formInputs.fname} ${formInputs.lname}`.trim(),
      email: formInputs.email,
      phone: formInputs.phone,
      address: `${formInputs.address}${
        formInputs.apartment ? ", " + formInputs.apartment : ""
      }, ${formInputs.city}, ${formInputs.postal || ""}, ${formInputs.country}`,
      apartment: formInputs.apartment,
      city: formInputs.city,
      postal: formInputs.postal,
      country: formInputs.country,
      boxType: orderType === "simple" ? "Simple Black Box" : "Personalised Box",
      inkColor: orderType === "custom" ? inkColor : "N/A",
      topText: orderType === "custom" && hasTopMsg ? topText : "",
      insideText: orderType === "custom" && hasInsideMsg ? insideText : "",
      bannerText: orderType === "custom" && hasBanner ? bannerText : "",
      addons: addonsList.join(", ") || "None",
      total: orderTotal.toLocaleString(),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const resJson = await response.json();
      if (response.ok && resJson.success) {
        setCheckoutStep("confirmation");
        localStorage.removeItem("saved_top");
        localStorage.removeItem("saved_inside");
      } else {
        alert("Failed to place order: " + (resJson.error || "Server error"));
      }
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Error sending order. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMockupFontSize = (text: string, isInside = false) => {
    const len = text.length;
    if (isInside) {
      return len < 25 ? "text-xl sm:text-2xl" : len < 80 ? "text-lg sm:text-xl" : "text-sm sm:text-base";
    }
    return len < 25 ? "text-2xl sm:text-3xl" : len < 55 ? "text-xl sm:text-2xl" : "text-base sm:text-lg";
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen font-sans-inter selection:bg-[var(--pink-200)] selection:text-[var(--pink-600)] bg-[#FFF9FA]">
      {/* ========== PARTICLES ========== */}
      <div id="particles" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle bg-[var(--pink-400)]/15"
            style={
              {
                left: p.left,
                width: p.size,
                height: p.size,
                "--dur": p.dur,
                "--delay": p.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ========== HEADER NAV ========== */}
      <nav
        id="mainNav"
        className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-16 py-5 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "bg-white/80 shadow-xl shadow-pink-600/5 backdrop-blur-xl border-b border-pink-100/40 py-3.5"
            : "bg-transparent py-6"
        }`}
      >
        <a href="#" className="font-dancing text-3xl font-black text-[var(--pink-500)] tracking-wide hover:opacity-90 transition-all">
          box<span className="text-[var(--dark-2)]">.</span>love
          <span className="text-[var(--dark-2)]">.</span>pk
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {["Our Boxes", "Build Yours", "Pricing", "How to Order"].map((section, idx) => {
            const anchor = ["#showcase", "#builder", "#pricing", "#payment"][idx];
            return (
              <li key={section}>
                <a
                  href={anchor}
                  className="relative text-[var(--text-mid)] text-sm font-semibold tracking-wide hover:text-[var(--pink-500)] transition-colors duration-300 group py-1"
                >
                  {section}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--pink-500)] transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-5">
          <a
            href="#builder"
            className="hidden sm:inline-block bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white px-7 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 transition-all duration-300"
          >
            Order Now
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2 md:hidden group hover:bg-pink-50 rounded-xl transition-all"
            aria-label="Toggle navigation menu"
          >
            <span
              className={`w-6 h-0.5 bg-[var(--pink-500)] rounded transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[var(--pink-500)] rounded transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[var(--pink-500)] rounded transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile menu drop down */}
        {menuOpen && (
          <div className="absolute top-[100%] left-0 right-0 bg-white/95 border-b border-pink-100 shadow-2xl backdrop-blur-2xl flex flex-col p-8 gap-6 md:hidden animate-fade-in z-50 rounded-b-3xl">
            {["Our Boxes", "Build Yours", "Pricing", "How to Order"].map((section, idx) => {
              const anchor = ["#showcase", "#builder", "#pricing", "#payment"][idx];
              return (
                <a
                  key={section}
                  href={anchor}
                  onClick={() => setMenuOpen(false)}
                  className="text-[var(--text-mid)] font-bold text-base py-1 hover:text-[var(--pink-500)] transition-all border-b border-pink-50/50"
                >
                  {section}
                </a>
              );
            })}
            <a
              href="#builder"
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white py-3.5 rounded-2xl text-center text-sm font-bold shadow-lg shadow-pink-500/20"
            >
              Build Your Box ✨
            </a>
          </div>
        )}
      </nav>

      {/* ========== HERO SECTION (REDESIGNED: 2-COLUMN PREMIUM LAYOUT) ========== */}
      <section
        id="home"
        className="relative min-h-screen bg-gradient-to-br from-[#FFF3F7] via-[#FDDAED] to-[#F1CBE0] flex items-center justify-center px-6 sm:px-12 md:px-16 pt-32 pb-24 overflow-hidden z-10"
      >
        {/* Floating background graphics */}
        <div className="hero-blob absolute w-[600px] h-[600px] bg-pink-500/20 top-[-100px] right-[-100px] rounded-full blur-[90px]" style={{ animation: "blobFloat1 9s ease-in-out infinite" }} />
        <div className="hero-blob absolute w-[500px] h-[500px] bg-amber-500/10 bottom-[-50px] left-[-80px] rounded-full blur-[90px]" style={{ animation: "blobFloat2 11s ease-in-out infinite" }} />

        {/* Sparkles */}
        <div className="sparkle" style={{ top: "15%", left: "10%", "--s-dur": "3.5s", "--s-delay": "0s" } as React.CSSProperties}>✨</div>
        <div className="sparkle" style={{ top: "25%", right: "12%", "--s-dur": "4.5s", "--s-delay": "0.5s" } as React.CSSProperties}>🌸</div>
        <div className="sparkle" style={{ bottom: "28%", left: "10%", "--s-dur": "4s", "--s-delay": "1s" } as React.CSSProperties}>💖</div>

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20 mx-auto">
          {/* Hero Left Column (Content) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="hero-badge inline-flex items-center gap-2 bg-white/80 border border-pink-500/20 text-[var(--pink-600)] text-[10px] sm:text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full shadow-md backdrop-blur-md mb-8">
              <span className="badge-dot w-2 h-2 rounded-full bg-[var(--pink-500)] animate-pulse-dot" />
              Handmade · FSD Based · Black Luxury Boxes
            </div>

            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[var(--dark-2)] leading-[1.1] tracking-tight mb-8">
              <span className="bg-gradient-to-r from-[var(--pink-500)] via-pink-600 to-[var(--pink-600)] bg-clip-text text-transparent">Boxes Made</span>
              <br />
              with <span className="font-dancing text-[var(--pink-500)] font-bold block sm:inline mt-2 hover:scale-105 transition-transform duration-300 cursor-default">Love</span>
            </h1>

            <p className="text-[var(--text-mid)] text-base sm:text-lg max-w-xl lg:mx-0 mx-auto leading-relaxed mb-10 font-medium">
              Sometimes the words written on the box mean more than the gift inside...... 💕
              <span className="block text-xs sm:text-sm font-extrabold mt-4 text-[var(--pink-600)] bg-pink-100/30 backdrop-blur-sm border border-pink-100/50 py-2.5 px-5 rounded-2xl max-w-max shadow-sm lg:mx-0 mx-auto">
                📸 Visit our Instagram{" "}
                <a
                  href="https://instagram.com/box.love.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:opacity-85 font-black"
                >
                  highlights section
                </a>{" "}
                to get more ideas!
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              {[
                { num: "100+", label: "Happy Customers", color: "text-[var(--pink-600)]" },
                { num: "5★", label: "Rating", color: "text-amber-600" },
                { num: "🖤", label: "Luxury Velvet", color: "text-[var(--dark-2)]" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/70 border border-white/40 rounded-2xl px-6 py-3.5 shadow-lg shadow-pink-500/5">
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.num}</div>
                  <div className="text-[9px] uppercase tracking-widest text-[var(--text-light)] font-black mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start max-w-md lg:mx-0 mx-auto">
              <a
                href="#builder"
                className="w-full sm:w-auto bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white px-8 py-4 rounded-2xl text-sm font-bold tracking-wider shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-center"
              >
                ✨ Build Your Box
              </a>
              <a
                href="#showcase"
                className="w-full sm:w-auto bg-white/70 border border-white/50 text-[var(--text-mid)] px-8 py-4 rounded-2xl text-sm font-bold tracking-wider shadow-md hover:bg-white/95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-center"
              >
                See Our Work →
              </a>
            </div>
          </div>

          {/* Hero Right Column (Sleek 3D Card Display) */}
          <div className="lg:col-span-5 flex justify-center mt-8 lg:mt-0 relative">
            <div className="absolute inset-0 bg-pink-300/10 blur-[80px] rounded-full" />
            <div
              className="relative w-full max-w-[340px] bg-white border border-pink-100 rounded-[32px] p-6 shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 group"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 shadow-inner border border-pink-100/10">
                <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[var(--pink-600)] font-black text-[9px] uppercase tracking-widest py-1.5 px-3.5 rounded-full shadow-md z-10">
                  ⚡ Preview
                </span>
                <Image
                  src="/myman.jpg"
                  alt="Luxury Black Box with gold lettering"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)] mb-1">
                Luxury Black Box
              </h3>
              <p className="text-[var(--text-mid)] text-xs leading-relaxed font-semibold">
                Customized handwritten messages in sparkling gold ink. Built with love in Faisalabad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SHOWCASE SECTION ========== */}
      <section id="showcase" className="py-28 px-6 sm:px-12 max-w-7xl mx-auto z-10 relative bg-white rounded-[32px] shadow-2xl shadow-pink-600/5 my-10 border border-pink-100/20">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4">
            💝 Our Collection
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--dark-2)]">
            Boxes Made with <span className="font-dancing text-pink-500 text-4xl sm:text-5xl block sm:inline">Love</span>
          </h2>
          <p className="text-[var(--text-mid)] text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
            Every box is a black luxury keepsake with golden or silver handwritten messages — real boxes, real feelings, real love. 🖤✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "My Man",
              desc: "Black luxury box with golden handwritten message. Perfect for anniversaries, surprises & special moments.",
              img: "/myman.jpg",
              badge: "✨ Best Seller",
            },
            {
              title: "Custom Box",
              desc: "Write a heartfelt message inside the box lid to express your feelings in a beautiful way.",
              img: "/inside.jpg",
              badge: "💕 Most Loved",
            },
            {
              title: "Birthday Box",
              desc: "A premium customized black birthday box with your personalized lid writing in gold or silver.",
              img: "/birthday.jpg",
              badge: "🖤 Simple & Elegant",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="box-card bg-white border border-pink-50 rounded-[28px] p-6 shadow-xl shadow-pink-500/5 group hover:shadow-pink-500/20 transition-all duration-500"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-inner border border-pink-100/10">
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[var(--pink-600)] font-black text-[10px] uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg z-10 border border-pink-100/40">
                  {item.badge}
                </span>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="card-info">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[var(--dark-2)] mb-3 group-hover:text-[var(--pink-500)] transition-all">
                  {item.title}
                </h3>
                <p className="text-[var(--text-mid)] text-xs sm:text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FAIRY LIGHTS DECOR STRIP ========== */}
      <div className="lights-strip h-5 relative overflow-hidden" aria-hidden="true" />

      {/* ========== BUILDER SECTION ========== */}
      <section id="builder" className="py-28 px-6 sm:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4">
            🎁 Make Your Own
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--dark-2)]">
            Build Your <span className="text-[var(--pink-500)]">Custom Box</span>
          </h2>
          <p className="text-[var(--text-mid)] text-sm sm:text-base mt-4">
            Choose your order type, personalise, and see your box come to life in real-time! 🖤✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Builder Options - Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Step 1: Order Type */}
            <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-pink-500/5">
              <div className="flex gap-4 mb-8 items-start">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--pink-500)] to-[var(--pink-600)] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md shadow-pink-500/20">
                  1
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)]">
                    Choose Your Order Type
                  </h3>
                  <p className="text-[var(--text-light)] text-xs sm:text-sm mt-0.5">
                    Just a box, or a personalised masterpiece?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Simple Card */}
                <button
                  type="button"
                  onClick={() => setOrderType("simple")}
                  className={`relative border-2 text-left rounded-3xl p-6 cursor-pointer transition-all duration-300 focus:outline-none ${
                    orderType === "simple"
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/45 ring-4 ring-[var(--pink-100)]/40 shadow-lg shadow-pink-500/5"
                      : "border-pink-100/60 bg-white hover:border-pink-300 hover:shadow-md"
                  }`}
                >
                  {orderType === "simple" && (
                    <span className="absolute top-4 right-4 bg-gradient-to-br from-[var(--pink-500)] to-[var(--pink-600)] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md">
                      ✓
                    </span>
                  )}
                  <span className="text-4xl block mb-3 animate-[floatIcon_3s_ease-in-out_infinite]">🖤</span>
                  <div className="font-bold text-base text-[var(--dark-2)] mb-1">
                    Simple Black Box
                  </div>
                  <div className="text-[var(--text-mid)] text-xs leading-relaxed mb-4 font-medium">
                    Just the premium black box with delivery. Add optional lights or ribbon.
                  </div>
                  <div className="font-extrabold text-[var(--pink-600)] text-sm sm:text-base bg-white/80 inline-block px-3 py-1 rounded-xl shadow-inner border border-pink-100/50">
                    Rs. 1,600 + DC
                  </div>
                </button>

                {/* Personalised Card */}
                <button
                  type="button"
                  onClick={() => setOrderType("custom")}
                  className={`relative border-2 text-left rounded-3xl p-6 cursor-pointer transition-all duration-300 focus:outline-none ${
                    orderType === "custom"
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/45 ring-4 ring-[var(--pink-100)]/40 shadow-lg shadow-pink-500/5"
                      : "border-pink-100/60 bg-white hover:border-pink-300 hover:shadow-md"
                  }`}
                >
                  {orderType === "custom" && (
                    <span className="absolute top-4 right-4 bg-gradient-to-br from-[var(--pink-500)] to-[var(--pink-600)] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md">
                      ✓
                    </span>
                  )}
                  <span className="text-4xl block mb-3 animate-[floatIcon_3.5s_ease-in-out_infinite]">✍️</span>
                  <div className="font-bold text-base text-[var(--dark-2)] mb-1">
                    Personalised Box
                  </div>
                  <div className="text-[var(--text-mid)] text-xs leading-relaxed mb-4 font-medium">
                    Write your message in golden or silver ink on top and/or inside the box.
                  </div>
                  <div className="font-extrabold text-[var(--pink-600)] text-sm sm:text-base bg-white/80 inline-block px-3 py-1 rounded-xl shadow-inner border border-pink-100/50">
                    Rs. 1,600 + writing
                  </div>
                </button>
              </div>

              {orderType === "simple" && (
                <div className="bg-pink-50/20 border border-pink-100/50 rounded-2xl p-5 mt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black border border-pink-200/20 shrink-0 shadow-md shadow-black/10" />
                  <div className="grow">
                    <strong className="block text-sm text-[var(--dark-2)]">
                      🖤 Simple Black Luxury Box
                    </strong>
                    <span className="text-[var(--text-light)] text-xs font-medium">
                      Clean, elegant — ready for your gift. Add lights or ribbon below.
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-sm font-black text-[var(--pink-600)]">Rs. 1,600</span>
                    <span className="text-[10px] text-[var(--text-light)] font-bold">Base Price</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Personalisation (Custom only) */}
            {orderType === "custom" && (
              <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-pink-500/5">
                <div className="flex gap-4 mb-8 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--pink-500)] to-[var(--pink-600)] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md shadow-pink-500/20">
                    2
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)]">
                      Write Your Messages
                    </h3>
                    <p className="text-[var(--text-light)] text-xs sm:text-sm mt-0.5">
                      Type and watch your words appear live on the box →
                    </p>
                  </div>
                </div>

                {/* Ink Color Selection */}
                <div className="mb-8">
                  <div className="text-xs sm:text-sm font-black text-[var(--dark-2)] mb-4">
                    🖊️ Choose Ink Colour
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {/* Gold Ink Option */}
                    <label
                      className={`flex items-center gap-4 border-2 rounded-2xl p-4 cursor-pointer hover:border-pink-300 transition-all ${
                        inkColor === "gold"
                          ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 shadow-md"
                          : "border-pink-100/60 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="inkColor"
                        value="gold"
                        checked={inkColor === "gold"}
                        onChange={() => setInkColor("gold")}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE08A] to-[#D4A853] border border-black/10 flex items-center justify-center text-xs font-black text-black/80 shadow-md">
                        Au
                      </div>
                      <div>
                        <span className="block font-black text-xs sm:text-sm text-[var(--dark-2)]">
                          Golden
                        </span>
                        <span className="text-[10px] text-[var(--text-light)] font-bold">Golden Ink</span>
                      </div>
                    </label>

                    {/* Silver Ink Option */}
                    <label
                      className={`flex items-center gap-4 border-2 rounded-2xl p-4 cursor-pointer hover:border-pink-300 transition-all ${
                        inkColor === "silver"
                          ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 shadow-md"
                          : "border-pink-100/60 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="inkColor"
                        value="silver"
                        checked={inkColor === "silver"}
                        onChange={() => setInkColor("silver")}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5F8FC] to-[#C8D4E0] border border-black/10 flex items-center justify-center text-xs font-black text-black/80 shadow-md">
                        Ag
                      </div>
                      <div>
                        <span className="block font-black text-xs sm:text-sm text-[var(--dark-2)]">
                          Silver
                        </span>
                        <span className="text-[10px] text-[var(--text-light)] font-bold">Silver Ink</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Top of Box Message */}
                <div className="border border-pink-100/70 rounded-2xl p-5 mb-5 hover:shadow-md transition-all duration-300 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={toggleTopMsg}
                      className="flex items-center gap-3 text-left focus:outline-none font-bold text-xs sm:text-sm text-[var(--dark-2)]"
                    >
                      <div
                        className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center text-[11px] text-white transition-all shadow-inner ${
                          hasTopMsg
                            ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                            : "border-pink-200 bg-white"
                        }`}
                      >
                        {hasTopMsg && "✓"}
                      </div>
                      ✍️ Write on Top of Box
                    </button>
                    <span className="text-xs font-extrabold text-[var(--pink-600)] bg-[var(--pink-50)] px-3.5 py-1 rounded-full shadow-inner border border-pink-100/30">
                      Rs. 2,300
                    </span>
                  </div>
                  <textarea
                    ref={topTextareaRef}
                    disabled={!hasTopMsg}
                    value={topText}
                    onChange={(e) => handleTopTextInput(e.target.value)}
                    maxLength={200}
                    rows={3}
                    placeholder={hasTopMsg ? "Type your customized top text here..." : "Check box to enable writing"}
                    style={{
                      borderColor: hasTopMsg
                        ? inkColor === "gold"
                          ? "var(--gold)"
                          : "var(--silver)"
                        : "var(--pink-100)",
                    }}
                    className="w-full bg-pink-50/10 border-2 focus:ring-1 focus:ring-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none text-[var(--dark-2)] disabled:opacity-50 disabled:bg-zinc-50/50 transition-colors"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] text-[var(--text-light)] font-bold">
                      {topText.length} / 200 chars
                    </span>
                    {hasTopMsg && topText.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSaveText("top")}
                        className={`text-[10px] font-bold py-1.5 px-4 rounded-full shadow-md transition-all ${
                          isSavedMsgTop
                            ? "bg-green-500 text-white"
                            : "bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white hover:brightness-105"
                        }`}
                      >
                        {isSavedMsgTop ? "✅ Saved!" : "💾 Save Message"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Inside of Box Message */}
                <div className="border border-pink-100/70 rounded-2xl p-5 mb-5 hover:shadow-md transition-all duration-300 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={toggleInsideMsg}
                      className="flex items-center gap-3 text-left focus:outline-none font-bold text-xs sm:text-sm text-[var(--dark-2)]"
                    >
                      <div
                        className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center text-[11px] text-white transition-all shadow-inner ${
                          hasInsideMsg
                            ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                            : "border-pink-200 bg-white"
                        }`}
                      >
                        {hasInsideMsg && "✓"}
                      </div>
                      📖 Also Write Inside the Box
                    </button>
                    <span className="text-xs font-extrabold text-[var(--pink-600)] bg-[var(--pink-50)] px-3.5 py-1 rounded-full shadow-inner border border-pink-100/30">
                      Rs. 2,600
                    </span>
                  </div>
                  <textarea
                    ref={insideTextareaRef}
                    disabled={!hasInsideMsg}
                    value={insideText}
                    onChange={(e) => handleInsideTextInput(e.target.value)}
                    maxLength={400}
                    rows={4}
                    placeholder={hasInsideMsg ? "Type your customized inside text here..." : "Check box to enable writing"}
                    style={{
                      borderColor: hasInsideMsg
                        ? inkColor === "gold"
                          ? "var(--gold)"
                          : "var(--silver)"
                        : "var(--pink-100)",
                    }}
                    className="w-full bg-pink-50/10 border-2 focus:ring-1 focus:ring-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none text-[var(--dark-2)] disabled:opacity-50 disabled:bg-zinc-50/50 transition-colors"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] text-[var(--text-light)] font-bold">
                      {insideText.length} / 400 chars
                    </span>
                    {hasInsideMsg && insideText.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSaveText("inside")}
                        className={`text-[10px] font-bold py-1.5 px-4 rounded-full shadow-md transition-all ${
                          isSavedMsgInside
                            ? "bg-green-500 text-white"
                            : "bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white hover:brightness-105"
                        }`}
                      >
                        {isSavedMsgInside ? "✅ Saved!" : "💾 Save Message"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Hanging Banner */}
                <div className="border-2 border-dashed border-pink-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-pink-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !hasBanner;
                        setHasBanner(next);
                        if (!next) setBannerText("");
                      }}
                      className="flex items-center gap-3 text-left focus:outline-none font-bold text-xs sm:text-sm text-[var(--dark-2)]"
                    >
                      <div
                        className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center text-[11px] text-white transition-all shadow-inner ${
                          hasBanner
                            ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                            : "border-pink-200 bg-white"
                        }`}
                      >
                        {hasBanner && "✓"}
                      </div>
                      🎏 Add Hanging Banner on Box
                    </button>
                    <span className="text-xs font-extrabold text-[var(--pink-600)] bg-[var(--pink-50)] px-3.5 py-1 rounded-full shadow-inner border border-pink-100/30">
                      + Rs. 350
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-light)] font-semibold mb-1 ml-8">
                    Letter-flag bunting hung on the box — great alternative to inside writing or as an extra!
                  </p>
                  <p className="text-[10px] text-pink-400 font-semibold mb-3 ml-8">
                    💡 Tip: Press Enter for a new line (e.g. &quot;HAPPY&quot; then &quot;BIRTHDAY&quot;)
                  </p>
                  <textarea
                    disabled={!hasBanner}
                    value={bannerText}
                    onChange={(e) => {
                      // Allow letters, spaces, newlines only — uppercase
                      const val = e.target.value.toUpperCase();
                      // Count only non-newline chars toward limit
                      const nonBreakChars = val.replace(/\n/g, "").length;
                      if (nonBreakChars <= 35) setBannerText(val);
                    }}
                    rows={3}
                    placeholder={hasBanner ? "E.g.\nHAPPY\nBIRTHDAY" : "Check box to add banner"}
                    className="w-full bg-white border-2 border-pink-100 focus:border-pink-400 focus:ring-1 focus:ring-pink-200 rounded-xl p-3 text-sm focus:outline-none text-[var(--dark-2)] font-bold tracking-widest disabled:opacity-50 disabled:bg-zinc-50/50 transition-colors uppercase placeholder:normal-case placeholder:font-normal placeholder:tracking-normal resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-[var(--text-light)] font-bold">
                      {bannerText.replace(/\n/g, "").length} / 35 chars
                    </span>
                    <span className="text-[10px] text-pink-400 font-semibold">Each letter = 1 flag tile</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Add-ons */}
            <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-pink-500/5">
              <div className="flex gap-4 mb-8 items-start">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--pink-500)] to-[var(--pink-600)] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md shadow-pink-500/20">
                  3
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)]">
                    Optional Add-ons
                  </h3>
                  <p className="text-[var(--text-light)] text-xs sm:text-sm mt-0.5">
                    Make it even more magical ✨
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Fairy Lights Card */}
                <button
                  type="button"
                  onClick={() => setAddons((prev) => ({ ...prev, fairy: !prev.fairy }))}
                  className={`flex items-center gap-4 border-2 text-left rounded-2xl p-5 cursor-pointer transition-all duration-300 focus:outline-none ${
                    addons.fairy
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-1 ring-[var(--pink-300)]/35 shadow-md"
                      : "border-pink-100/60 bg-white hover:border-pink-300 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center text-[11px] text-white shrink-0 transition-all ${
                      addons.fairy
                        ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                        : "border-pink-200 bg-white"
                    }`}
                  >
                    {addons.fairy && "✓"}
                  </div>
                  <div className="grow">
                    <strong className="block text-xs sm:text-sm text-[var(--dark-2)]">
                      Fairy Lights
                    </strong>
                  </div>
                  <div className="font-extrabold text-[var(--pink-600)] text-xs sm:text-sm shrink-0">
                    + Rs. 300
                  </div>
                </button>

                {/* Ribbon Bow Card */}
                <button
                  type="button"
                  onClick={() => setAddons((prev) => ({ ...prev, ribbon: !prev.ribbon }))}
                  className={`flex items-center gap-4 border-2 text-left rounded-2xl p-5 cursor-pointer transition-all duration-300 focus:outline-none ${
                    addons.ribbon
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-1 ring-[var(--pink-300)]/35 shadow-md"
                      : "border-pink-100/60 bg-white hover:border-pink-300 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center text-[11px] text-white shrink-0 transition-all ${
                      addons.ribbon
                        ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                        : "border-pink-200 bg-white"
                    }`}
                  >
                    {addons.ribbon && "✓"}
                  </div>
                  <div className="grow">
                    <strong className="block text-xs sm:text-sm text-[var(--dark-2)]">
                      Ribbon Bow
                    </strong>
                  </div>
                  <div className="font-extrabold text-[var(--pink-600)] text-xs sm:text-sm shrink-0">
                    + Rs. 100
                  </div>
                </button>

                {/* Hanging Banner Card — full width */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !hasBanner;
                    setHasBanner(next);
                    if (!next) setBannerText("");
                  }}
                  className={`col-span-1 sm:col-span-2 flex items-center gap-4 border-2 text-left rounded-2xl p-5 cursor-pointer transition-all duration-300 focus:outline-none ${
                    hasBanner
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-1 ring-[var(--pink-300)]/35 shadow-md"
                      : "border-dashed border-pink-200 bg-white hover:border-pink-400 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center text-[11px] text-white shrink-0 transition-all ${
                      hasBanner
                        ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                        : "border-pink-200 bg-white"
                    }`}
                  >
                    {hasBanner && "✓"}
                  </div>
                  <div className="grow">
                    <strong className="block text-xs sm:text-sm text-[var(--dark-2)]">
                      🎏 Hanging Banner on Box
                    </strong>
                    <span className="text-[10px] text-[var(--text-light)] font-medium">
                      Letter-flag bunting — e.g. &quot;HAPPY BIRTHDAY&quot; or &quot;I LOVE YOU&quot;
                    </span>
                  </div>
                  <div className="font-extrabold text-[var(--pink-600)] text-xs sm:text-sm shrink-0">
                    + Rs. 350
                  </div>
                </button>
              </div>

              {/* Banner text input — shown when banner is selected */}
              {hasBanner && (
                <div className="mt-5 border-2 border-pink-200 rounded-2xl p-4 bg-gradient-to-br from-white to-pink-50/30">
                  <p className="text-[11px] font-bold text-[var(--dark-2)] mb-1">
                    🎏 What should the banner say?
                  </p>
                  <p className="text-[10px] text-pink-400 font-semibold mb-3">
                    💡 Tip: Press Enter for a new line (e.g. &quot;HAPPY&quot; then &quot;BIRTHDAY&quot;)
                  </p>
                  <textarea
                    value={bannerText}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      const nonBreakChars = val.replace(/\n/g, "").length;
                      if (nonBreakChars <= 35) setBannerText(val);
                    }}
                    rows={3}
                    placeholder={"E.g.\nHAPPY\nBIRTHDAY"}
                    className="w-full bg-white border-2 border-pink-100 focus:border-pink-400 focus:ring-1 focus:ring-pink-200 rounded-xl p-3 text-sm focus:outline-none text-[var(--dark-2)] font-bold tracking-widest transition-colors uppercase placeholder:normal-case placeholder:font-normal placeholder:tracking-normal resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-[var(--text-light)] font-bold">
                      {bannerText.replace(/\n/g, "").length} / 35 chars
                    </span>
                    <span className="text-[10px] text-pink-400 font-semibold">Each letter = 1 flag tile</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel & Cart Summary - Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-24">
            {/* LIVE PREVIEW CONTAINER */}
            <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-xl shadow-pink-500/5">
              <div className="flex bg-[var(--pink-50)] p-1 rounded-xl mb-5 border border-pink-100/20">
                <button
                  type="button"
                  onClick={() => setPreviewTab("top")}
                  className={`flex-1 font-extrabold text-[11px] sm:text-xs py-2.5 rounded-lg transition-all ${
                    previewTab === "top"
                      ? "bg-white text-[var(--pink-600)] shadow-md"
                      : "text-[var(--text-light)]"
                  }`}
                >
                  🖤 Box Top
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (orderType === "custom" && hasInsideMsg) {
                      setPreviewTab("inside");
                    } else if (orderType === "custom") {
                      alert("Please check 'Also Write Inside the Box' above to view the inside message!");
                    } else {
                      alert("Inside writing is only available on Personalised Boxes!");
                    }
                  }}
                  className={`flex-1 font-extrabold text-[11px] sm:text-xs py-2.5 rounded-lg transition-all ${
                    orderType === "custom" && hasInsideMsg ? "opacity-100" : "opacity-35"
                  } ${
                    previewTab === "inside"
                      ? "bg-white text-[var(--pink-600)] shadow-md"
                      : "text-[var(--text-light)]"
                  }`}
                >
                  📖 Inside
                </button>
              </div>

              {orderType === "simple" ? (
                /* Simple box preview display */
                <div className="flex flex-col items-center justify-center min-h-[220px] bg-gradient-to-br from-[#FFF8FA] to-white border border-pink-100/40 rounded-2xl p-6 shadow-inner text-center">
                  <span className="text-6xl mb-4 animate-[floatIcon_3s_ease-in-out_infinite]">🖤</span>
                  <span className="font-dancing text-lg text-[var(--pink-600)] font-black italic">
                    Simple Luxury Black Box
                  </span>
                  <span className="text-[10px] text-[var(--text-light)] uppercase tracking-wider font-bold mt-2">
                    Ready for delivery
                  </span>
                </div>
              ) : (
                /* Custom box preview mockup */
                <div className="relative overflow-hidden rounded-2xl shadow-inner bg-[#FFF8FA]">
                  <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(194,51,106,0.01) 100%) pointer-events-none" />

                  {/* Top pane view */}
                  {previewTab === "top" ? (
                    <div className="box-face-flat border-2 border-[var(--gold)]/35">
                      <div className="absolute top-3.5 left-3.5 bg-white/20 border border-white/10 backdrop-blur-md rounded-lg px-3 py-1 text-[9px] font-bold text-white/80 uppercase tracking-widest z-20 shadow-sm">
                        Top of Box
                      </div>

                      {/* Hanging Banner Preview */}
                      {hasBanner && bannerText.trim().length > 0 && (() => {
                        const lines = bannerText.split("\n").filter(l => l.trim().length > 0);
                        return (
                          <div className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center pointer-events-none" style={{ paddingTop: "4px" }}>
                            {lines.map((line, lineIdx) => (
                              <div key={lineIdx} className="relative flex flex-col items-center w-full mb-0.5">
                                {/* Ribbon string */}
                                <svg className="w-full h-4" viewBox="0 0 300 14" preserveAspectRatio="none">
                                  <path d="M0,3 Q75,11 150,3 Q225,11 300,3" stroke="#888" strokeWidth="1" fill="none" strokeDasharray="4 2" opacity="0.55"/>
                                </svg>
                                {/* Flag tiles for this line */}
                                <div className="flex items-end gap-0.5 flex-wrap justify-center max-w-[92%]">
                                  {line.split("").map((letter, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                      <div
                                        className="w-4 h-5 bg-white border border-gray-300 flex items-center justify-center text-[9px] font-black text-gray-800 shadow-sm"
                                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)" }}
                                      >
                                        {letter === " " ? "\u00A0" : letter}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      <div className="relative text-center p-6 w-full z-10" style={{ paddingTop: hasBanner && bannerText.trim().length > 0 ? `${(bannerText.split("\n").filter(l => l.trim().length > 0).length * 2.2) + 0.5}rem` : "1.5rem" }}>
                        {hasTopMsg && topText.trim().length > 0 ? (
                          <span
                            className={`live-gold-text ${
                              inkColor === "silver" ? "silver-ink" : "gold-ink"
                            } ${getMockupFontSize(topText)}`}
                          >
                            {topText}
                          </span>
                        ) : (
                          <span className="live-gold-text placeholder-gold">
                            {hasBanner
                              ? (bannerText.trim().length === 0 ? "Type banner text above... 🎏" : "")
                              : hasTopMsg
                              ? "Start typing your top message... ✨"
                              : 'Enable "Write on Top" above to preview ✨'}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Inside pane view */
                    <div className="box-face-flat box-face-inside border-2 border-[var(--gold)]/35">
                      <div className="absolute top-3.5 left-3.5 bg-white/20 border border-white/10 backdrop-blur-md rounded-lg px-3 py-1 text-[9px] font-bold text-white/80 uppercase tracking-widest z-20 shadow-sm">
                        Inside of Box
                      </div>
                      <div className="relative text-center p-6 w-full z-10">
                        {hasInsideMsg && insideText.trim().length > 0 ? (
                          <span
                            className={`live-gold-text ${
                              inkColor === "silver" ? "silver-ink" : "gold-ink"
                            } ${getMockupFontSize(insideText, true)}`}
                          >
                            {insideText}
                          </span>
                        ) : (
                          <span className="live-gold-text placeholder-gold">
                            {hasInsideMsg
                              ? "Type your inside message above... 💕"
                              : 'Enable "Write Inside" above to preview 💕'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CART CONTAINER */}
            <div className="bg-gradient-to-b from-white to-[#FFFDFE] border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-500/5">
              <div className="flex items-center justify-between mb-6">
                <div className="font-playfair font-black text-xl text-[var(--dark-2)] flex items-center gap-2">
                  <span>🛒</span> Your Order
                </div>
                <div className="bg-[var(--pink-50)] text-[var(--pink-600)] font-black text-[10px] uppercase tracking-widest py-1.5 px-4 rounded-full shadow-inner border border-pink-100/30">
                  {orderType === "simple" ? "1 Item" : "Personalised"}
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-6 text-sm font-medium">
                <div className="flex justify-between items-center text-[var(--text-mid)]">
                  <span>🖤 Black Luxury Box</span>
                  <span className="font-extrabold text-[var(--dark-2)]">Rs. 1,600</span>
                </div>

                {orderType === "custom" && hasTopMsg && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>✍️ Writing on Top ({inkColor === "silver" ? "Silver" : "Gold"})</span>
                    <span className="font-extrabold text-[var(--dark-2)]">Rs. 300</span>
                  </div>
                )}

                {orderType === "custom" && hasInsideMsg && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>📖 Writing Inside ({inkColor === "silver" ? "Silver" : "Gold"})</span>
                    <span className="font-extrabold text-[var(--dark-2)]">Rs. 300</span>
                  </div>
                )}

                {hasBanner && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>🎏 Hanging Banner{bannerText.trim() ? ` — "${bannerText.replace(/\n/g, " / ")}"` : ""}</span>
                    <span className="font-extrabold text-[var(--dark-2)]">Rs. 350</span>
                  </div>
                )}

                {addons.fairy && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>🌟 Fairy Lights</span>
                    <span className="font-extrabold text-[var(--dark-2)]">Rs. 300</span>
                  </div>
                )}

                {addons.ribbon && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>🎀 Ribbon &amp; Bow</span>
                    <span className="font-extrabold text-[var(--dark-2)]">Rs. 100</span>
                  </div>
                )}

                <div className="h-px border-t border-dashed border-pink-100 my-2" />

                <div className="flex justify-between items-center text-[var(--text-mid)]">
                  <span>📦 Delivery Charges</span>
                  <span className="font-extrabold text-[var(--pink-600)]">Rs. 400</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-pink-100 pt-5 mb-6">
                <span className="font-bold text-base text-[var(--dark-2)]">Total Amount</span>
                <span className="font-playfair font-extrabold text-2xl sm:text-3xl text-[var(--pink-600)] bg-[var(--pink-50)]/45 px-4 py-1.5 rounded-2xl shadow-inner border border-pink-100/20">
                  Rs. {calculateTotal().toLocaleString()}
                </span>
              </div>

              <div className="bg-pink-50/20 border border-pink-100/40 rounded-2xl p-4.5 text-xs text-stone-700 leading-relaxed mb-6 font-medium">
                💳 <strong>Advance payment via JazzCash required.</strong> Order confirms **ONLY** after
                you send the payment receipt screenshot on Instagram DM! 📸
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white py-4.5 rounded-2xl text-center font-black text-sm shadow-xl shadow-pink-500/20 hover:shadow-pink-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Place Order →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRICING TABLE SECTION ========== */}
      <section id="pricing" className="py-28 px-6 max-w-4xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4">
            Price Breakdown
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-[var(--dark-2)]">
            What's <span className="text-[var(--pink-500)]">Included</span>
          </h2>
          <p className="text-[var(--text-mid)] text-sm sm:text-base mt-4 font-medium">
            Clear, honest pricing — no hidden charges
          </p>
        </div>

        <div className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-2xl shadow-pink-500/5">
          <div className="flex justify-between items-center bg-gradient-to-r from-[var(--pink-50)] to-[#FFFFFF] p-5 font-bold text-xs uppercase tracking-widest text-[var(--text-mid)] border-b border-pink-100/70">
            <span>Item</span>
            <span>Price</span>
          </div>

          {[
            { name: "Black Luxury Box", label: "Always Included", price: "Rs. 1,600" },
            { name: "Writing on Top", label: "Optional", price: "Rs. 300" },
            { name: "Writing Inside", label: "Optional", price: "Rs. 300" },
            { name: "Golden Ink", label: "Choose One", price: "Included" },
            { name: "Silver Ink", label: "Choose One", price: "Included" },
            { name: "Fairy Lights", label: "Optional", price: "Rs. 300" },
            { name: "Ribbon Bow", label: "Optional", price: "Rs. 100" },
            {
              name: "Delivery Charges",
              label: "Always Added",
              price: "Rs. 400",
              highlight: true,
            },
          ].map((row, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center px-6 py-5 text-xs sm:text-sm border-b border-pink-50/50 last:border-none ${
                row.highlight ? "bg-[var(--pink-50)]/45" : ""
              }`}
            >
              <span className="font-bold text-[var(--dark-2)] flex flex-wrap items-center gap-2">
                {row.name}
                <span className="text-[9px] font-black text-[var(--text-light)] border border-pink-200/50 bg-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {row.label}
                </span>
              </span>
              <span className="font-extrabold text-[var(--text-mid)]">{row.price}</span>
            </div>
          ))}

          <div className="flex justify-between items-center bg-[var(--pink-100)]/30 px-6 py-6 border-t border-pink-200/60">
            <span className="font-bold text-sm sm:text-base text-[var(--pink-600)]">
              Simple Box (Min Order)
            </span>
            <span className="font-playfair font-black text-xl sm:text-2xl text-[var(--dark-2)]">
              Rs. 2,000
            </span>
          </div>
        </div>
      </section>

      {/* ========== PAYMENT & GUIDE SECTION (REDESIGNED LUXURY CREDIT CARD CARD) ========== */}
      <section id="payment" className="py-28 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4">
            How to Order
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-[var(--dark-2)]">
            Simple <span className="text-[var(--pink-500)]">Payment</span> Process
          </h2>
          <p className="text-[var(--text-mid)] text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Advance payment is required. Order confirms **ONLY** after you send the payment receipt
            screenshot on Instagram DM! 📸💕
          </p>
        </div>

        <div className="flex flex-col gap-14">
          {/* Metal Credit Card design for JazzCash */}
          <div className="relative w-full max-w-[420px] aspect-[1.58/1] bg-gradient-to-tr from-[#1a1a1a] via-[#2d2d2d] to-[#0a0a0a] border border-[#d4a853]/45 rounded-3xl p-6 sm:p-8 mx-auto shadow-2xl shadow-black/55 text-white overflow-hidden group">
            {/* Holographic reflection lines */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-yellow-500/5 blur-[50px] rounded-full" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="block text-[8px] sm:text-[10px] tracking-widest text-[#d4a853] uppercase font-black">
                  JazzCash Account
                </span>
                <span className="font-dancing text-xl sm:text-2xl font-bold text-white/90">Nazi Yaqoob</span>
              </div>
              {/* Gold Chip */}
              <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-[#ffe08a] to-[#cba34f] border border-black/10 shadow-sm relative overflow-hidden flex flex-col justify-between p-1.5">
                <div className="h-px bg-black/20 w-full" />
                <div className="h-px bg-black/20 w-full" />
                <div className="h-px bg-black/20 w-full" />
              </div>
            </div>

            {/* Account Number */}
            <div className="my-5">
              <span className="block text-[8px] uppercase tracking-wider text-white/40 mb-1">Account Number</span>
              <div className="font-playfair text-xl sm:text-2xl font-black text-[#d4a853] tracking-widest text-center">
                0300 6600 178
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-white/40">Status</span>
                <span className="text-[10px] sm:text-xs font-bold text-green-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Active &amp; Verified
                </span>
              </div>
              <span className="font-dancing text-lg text-white/60">box.love.pk</span>
            </div>
          </div>

          {/* Steps List */}
          <div className="w-full bg-white border border-pink-100 rounded-[32px] p-6 sm:p-12 shadow-2xl shadow-pink-500/5 border-pink-100/40">
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[var(--dark-2)] mb-10 text-center">
              🎀 How Your Order Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                "Build your box above, write your message & check your order total (includes Rs. 400 delivery).",
                "Open JazzCash, send the exact total to 0300-6600178. Confirm Nazi Yaqoob displays as the name.",
                "Take a screenshot of the JazzCash receipt and send it via Instagram DM to @box.love.pk",
                "Once verified, your order confirms and goes into handmade production. No refund after confirmation.",
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col gap-5 relative bg-pink-50/10 border border-pink-100/20 rounded-2xl p-5">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--pink-50)] text-[var(--pink-500)] flex items-center justify-center font-extrabold text-lg shadow-inner">
                    0{idx + 1}
                  </div>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER SECTION ========== */}
      <footer className="bg-[#FFF0F4]/60 border-t border-pink-100/60 py-16 px-6 text-center text-xs sm:text-sm relative z-10">
        <span className="font-dancing text-3xl font-black text-[var(--pink-500)] tracking-wide block mb-4">
          box.love.pk
        </span>
        <p className="text-[var(--text-mid)] font-black max-w-md mx-auto mb-3 leading-relaxed">
          Customized Black Luxury Boxes with Golden &amp; Silver Writing ♥ Handmade in Faisalabad, Pakistan
        </p>
        <p className="text-[var(--text-light)] font-bold">
          <a
            href="https://instagram.com/box.love.pk"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[var(--pink-500)]"
          >
            @box.love.pk
          </a>{" "}
          · Advance payment only · No refund after order confirmation
        </p>
        <p className="text-[var(--text-light)] opacity-60 text-[10px] mt-8 font-bold">
          © 2026 box.love.pk — All Rights Reserved
        </p>
      </footer>

      {/* ========== CHECKOUT MODAL ========== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-[modalFadeIn_0.3s_ease-out_forwards]">
          <div className="bg-white rounded-[32px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-10 animate-[modalSlideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
            <button
              onClick={() => {
                setModalOpen(false);
                setCheckoutStep("form");
              }}
              className="absolute top-5 right-5 text-stone-500 hover:text-stone-850 p-2.5 text-xl focus:outline-none hover:bg-pink-50 rounded-xl transition-all"
              aria-label="Close modal"
            >
              ✕
            </button>

            {checkoutStep === "form" ? (
              /* --- Step 1: Checkout Form --- */
              <form onSubmit={handleSubmitCheckout} className="space-y-6">
                <div className="text-center border-b border-pink-100 pb-5">
                  <span className="font-dancing text-3xl font-black text-[var(--pink-500)]">
                    box.love.pk
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)] mt-1">
                    Checkout Summary
                  </h3>
                </div>

                {/* Collapsible Order Summary */}
                <div className="border border-pink-100 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setSummaryOpen(!summaryOpen)}
                    className="w-full flex justify-between items-center bg-pink-50/40 px-4 py-3.5 text-xs font-bold text-[var(--text-mid)] focus:outline-none"
                  >
                    <span>{summaryOpen ? "▼ Hide" : "▶ Show"} Order Summary</span>
                    <span className="text-[var(--pink-600)] font-extrabold">
                      Rs. {calculateTotal().toLocaleString()}
                    </span>
                  </button>

                  {summaryOpen && (
                    <div className="p-4 bg-white border-t border-pink-50 text-xs space-y-2.5 font-medium">
                      <div className="flex justify-between">
                        <span>Black Luxury Box</span>
                        <span>Rs. 1,600</span>
                      </div>
                      {orderType === "custom" && hasTopMsg && (
                        <div className="flex justify-between">
                          <span>Top Writing ({inkColor === "silver" ? "Silver" : "Gold"})</span>
                          <span>Rs. 300</span>
                        </div>
                      )}
                      {orderType === "custom" && hasInsideMsg && (
                        <div className="flex justify-between">
                          <span>Inside Writing ({inkColor === "silver" ? "Silver" : "Gold"})</span>
                          <span>Rs. 300</span>
                        </div>
                      )}
                      {addons.fairy && (
                        <div className="flex justify-between">
                          <span>Fairy Lights</span>
                          <span>Rs. 300</span>
                        </div>
                      )}
                      {addons.ribbon && (
                        <div className="flex justify-between">
                          <span>Ribbon Bow</span>
                          <span>Rs. 100</span>
                        </div>
                      )}
                      <div className="h-px bg-pink-50" />
                      <div className="flex justify-between font-extrabold text-[var(--pink-600)]">
                        <span>Shipping (Faisalabad Standard)</span>
                        <span>Rs. 400</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Section */}
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    Contact Details
                  </h4>
                  <input
                    type="email"
                    id="chk-email"
                    required
                    placeholder="Email Address"
                    value={formInputs.email}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] focus:ring-1 focus:ring-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none shadow-sm"
                  />
                  <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      id="chk-newsletter"
                      checked={formInputs.newsletter}
                      onChange={handleInputChange}
                      className="accent-[var(--pink-500)] w-4 h-4 rounded"
                    />
                    <span>Email me with news and special offers</span>
                  </label>
                </div>

                {/* Delivery Address Section */}
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    Delivery Address
                  </h4>
                  <select
                    id="chk-country"
                    value={formInputs.country}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none bg-white font-semibold"
                  >
                    <option value="Pakistan">Pakistan</option>
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      id="chk-fname"
                      placeholder="First name (optional)"
                      value={formInputs.fname}
                      onChange={handleInputChange}
                      className="border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none shadow-sm"
                    />
                    <input
                      type="text"
                      id="chk-lname"
                      required
                      placeholder="Last name"
                      value={formInputs.lname}
                      onChange={handleInputChange}
                      className="border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none shadow-sm"
                    />
                  </div>

                  <input
                    type="text"
                    id="chk-address"
                    required
                    placeholder="Address"
                    value={formInputs.address}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none shadow-sm"
                  />

                  <input
                    type="text"
                    id="chk-apartment"
                    placeholder="Apartment, suite, unit (optional)"
                    value={formInputs.apartment}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none shadow-sm"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      id="chk-city"
                      required
                      placeholder="City"
                      value={formInputs.city}
                      onChange={handleInputChange}
                      className="border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none shadow-sm"
                    />
                    <input
                      type="text"
                      id="chk-postal"
                      placeholder="Postal Code (optional)"
                      value={formInputs.postal}
                      onChange={handleInputChange}
                      className="border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none shadow-sm"
                    />
                  </div>

                  <input
                    type="tel"
                    id="chk-phone"
                    required
                    placeholder="Mobile Number (e.g. 03001234567)"
                    value={formInputs.phone}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none shadow-sm"
                  />

                  <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      id="chk-saveInfo"
                      checked={formInputs.saveInfo}
                      onChange={handleInputChange}
                      className="accent-[var(--pink-500)] w-4 h-4 rounded"
                    />
                    <span>Save this information for next time</span>
                  </label>
                </div>

                {/* Shipping Method display */}
                <div className="space-y-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    Shipping Method
                  </h4>
                  <div className="flex justify-between items-center bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3.5 text-sm font-semibold">
                    <span className="text-stone-700">Standard Delivery (Pakistan)</span>
                    <span className="text-[var(--pink-600)]">Rs. 400</span>
                  </div>
                </div>

                {/* Payment method info */}
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    Payment Info
                  </h4>
                  <div className="border border-pink-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center bg-pink-50/20 px-4 py-3.5 text-sm font-bold text-stone-750 border-b border-pink-50">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[var(--pink-500)] animate-pulse" />
                        <span>Advance Payment (JazzCash)</span>
                      </div>
                      <span>🔒 Secure</span>
                    </div>
                    <div className="p-4 bg-white text-xs text-stone-700 space-y-2 leading-relaxed">
                      <p>
                        Advance payment only via JazzCash to <strong>0300-6600178</strong> (Account Name:{" "}
                        <strong>NAZI YAQOOB</strong>).
                      </p>
                      <p className="text-red-600 font-extrabold">
                        ❌ Cash on Delivery (COD) is not available.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white py-4.5 rounded-2xl text-center font-black text-sm shadow-xl shadow-pink-500/20 hover:shadow-pink-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 transition-all duration-300"
                >
                  {isSubmitting ? "⏳ Processing Order..." : "Complete Order →"}
                </button>
              </form>
            ) : (
              /* --- Step 2: Post-Checkout Confirmation --- */
              <div className="space-y-6 text-center animate-[successBounce_0.4s_ease-out_forwards]">
                <div className="text-6xl animate-bounce">🎁</div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[var(--dark-2)]">
                  Order Placed!
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-medium">
                  Thank you, <strong className="text-[var(--pink-600)]">{formInputs.fname}</strong>!
                  Your order is received.
                  <strong className="block text-[var(--pink-600)] mt-4 font-black">
                    ⚠️ Note: Your order confirms ONLY after you send the payment receipt screenshot on
                    Instagram DM! 📸
                  </strong>
                </p>

                {/* JazzCash Info Box */}
                <div className="bg-gradient-to-br from-white to-[var(--pink-50)]/45 border-2 border-pink-100 rounded-2xl p-5 text-left text-xs space-y-2.5 shadow-sm">
                  <div className="font-bold text-[var(--pink-500)] text-sm border-b border-pink-100 pb-2">
                    JazzCash Account details:
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-light)] font-bold">Number</span>
                    <strong className="text-sm tracking-wider text-[var(--pink-600)]">0300-6600178</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-light)] font-bold">Account Name</span>
                    <strong className="text-stone-850">NAZI YAQOOB</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-light)] font-bold">Amount to Send</span>
                    <strong className="text-sm text-[var(--pink-600)]">
                      Rs. {calculateTotal().toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Instagram Direct Link */}
                <div className="bg-pink-50/20 border border-pink-100/60 rounded-2xl p-6 flex flex-col items-center gap-3.5 text-center">
                  <span className="text-3xl animate-[floatIcon_3s_ease-in-out_infinite]">📸</span>
                  <strong className="text-xs sm:text-sm text-[var(--pink-600)] block font-extrabold">
                    Send Payment Screenshot
                  </strong>
                  <p className="text-stone-750 text-[11px] leading-relaxed font-semibold">
                    Take a screenshot of your successful transaction receipt and send it to us on Instagram
                    so we can confirm your order immediately! 💕
                  </p>
                  <a
                    href="https://instagram.com/box.love.pk"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C2336A] to-[#9B2452] text-white py-3 px-7 rounded-full font-black text-xs shadow-lg shadow-pink-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all mt-1"
                  >
                    📩 Send screenshot @box.love.pk
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
