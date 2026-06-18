"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Prices Configuration
const PRICES = {
  box: 1600,
  top: 300,
  inside: 300,
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
  addons: string;
  total: string;
}

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [orderType, setOrderType] = useState<"simple" | "custom">("custom");
  const [inkColor, setInkColor] = useState<"gold" | "silver">("gold");
  const [hasTopMsg, setHasTopMsg] = useState(false);
  const [hasInsideMsg, setHasInsideMsg] = useState(false);
  const [topText, setTopText] = useState("");
  const [insideText, setInsideText] = useState("");
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
    if (addons.fairy) total += PRICES.fairy;
    if (addons.ribbon) total += PRICES.ribbon;
    return total;
  };

  const getAddonsText = () => {
    const list: string[] = [];
    if (addons.fairy) list.push("Fairy Lights");
    if (addons.ribbon) list.push("Ribbon Bow");
    return list.length > 0 ? list.join(", ") : "None";
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
    const ry = x * 15; // max 15 deg
    const rx = -y * 12; // max 12 deg
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
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

    // Validate inputs
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

    // Save info if checked
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

    // Compile order details
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
        // Clear saved messages
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

  // Font size calculation for mockup preview text
  const getMockupFontSize = (text: string, isInside = false) => {
    const len = text.length;
    if (isInside) {
      return len < 25 ? "text-2xl" : len < 80 ? "text-xl" : len < 160 ? "text-base" : "text-sm";
    }
    return len < 25 ? "text-3xl" : len < 55 ? "text-2xl" : len < 100 ? "text-lg" : "text-sm";
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* ========== PARTICLES ========== */}
      <div id="particles" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle bg-[var(--pink-300)] opacity-10"
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
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-white/95 py-2.5 shadow-md shadow-pink-600/5 backdrop-blur-md"
            : "bg-white/80 backdrop-blur-md border-b border-pink-100/45"
        }`}
      >
        <a href="#" className="font-dancing text-3xl font-bold text-[var(--pink-500)] tracking-wide">
          box<span className="text-[var(--dark-2)]">.</span>love
          <span className="text-[var(--dark-2)]">.</span>pk
        </a>

        <ul className="hidden md:flex items-center gap-9">
          {["Our Boxes", "Build Yours", "Pricing", "How to Order"].map((section, idx) => {
            const anchor = ["#showcase", "#builder", "#pricing", "#payment"][idx];
            return (
              <li key={section}>
                <a
                  href={anchor}
                  className="relative text-[var(--text-mid)] text-sm font-medium hover:text-[var(--pink-500)] transition-colors duration-200 group py-1"
                >
                  {section}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--pink-500)] transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <a
            href="#builder"
            className="hidden sm:inline-block bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-lg shadow-pink-500/25 hover:shadow-pink-500/35 hover:-translate-y-0.5 transition-all duration-300"
          >
            Order Now
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2 md:hidden group"
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
          <div className="absolute top-[100%] left-0 right-0 bg-white/95 border-b border-pink-100 shadow-xl backdrop-blur-xl flex flex-col p-6 gap-5 md:hidden animate-fade-in z-50">
            {["Our Boxes", "Build Yours", "Pricing", "How to Order"].map((section, idx) => {
              const anchor = ["#showcase", "#builder", "#pricing", "#payment"][idx];
              return (
                <a
                  key={section}
                  href={anchor}
                  onClick={() => setMenuOpen(false)}
                  className="text-[var(--text-mid)] font-semibold text-base py-1 hover:text-[var(--pink-500)] transition-all"
                >
                  {section}
                </a>
              );
            })}
            <a
              href="#builder"
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white py-3 rounded-xl text-center text-sm font-bold shadow-lg shadow-pink-500/20"
            >
              Build Your Box ✨
            </a>
          </div>
        )}
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section
        id="home"
        className="relative min-h-screen bg-gradient-to-br from-[#FFF0F6] via-[#FDDAED] to-[#F9C8E2] flex items-center justify-center px-6 pt-28 pb-16 overflow-hidden z-10"
      >
        {/* Glowing Background Blobs */}
        <div className="hero-blob blob-1 absolute w-[500px] h-[500px] bg-pink-500/15 top-[-100px] right-[-100px] rounded-full blur-[80px]" style={{ animation: "blobFloat1 8s ease-in-out infinite" }} />
        <div className="hero-blob blob-2 absolute w-[400px] h-[400px] bg-yellow-500/10 bottom-[-50px] left-[-80px] rounded-full blur-[80px]" style={{ animation: "blobFloat2 10s ease-in-out infinite" }} />
        <div className="hero-blob blob-3 absolute w-[300px] h-[300px] bg-pink-400/15 top-[40%] left-[40%] rounded-full blur-[80px]" style={{ animation: "blobFloat3 7s ease-in-out infinite" }} />

        {/* Floating Emojis */}
        <div className="sparkle" style={{ top: "12%", left: "8%", "--s-dur": "3s", "--s-delay": "0s" } as React.CSSProperties}>✨</div>
        <div className="sparkle" style={{ top: "20%", right: "10%", "--s-dur": "4s", "--s-delay": "0.7s" } as React.CSSProperties}>🌸</div>
        <div className="sparkle" style={{ bottom: "25%", left: "8%", "--s-dur": "3.5s", "--s-delay": "1.2s" } as React.CSSProperties}>💖</div>
        <div className="sparkle" style={{ bottom: "12%", right: "12%", "--s-dur": "5s", "--s-delay": "0.3s" } as React.CSSProperties}>⭐</div>
        <div className="sparkle" style={{ top: "50%", right: "5%", "--s-dur": "3.2s", "--s-delay": "1.8s" } as React.CSSProperties}>🎀</div>

        <div className="max-w-4xl w-full text-center relative z-20 mx-auto">
          <div className="hero-badge inline-flex items-center gap-2 bg-white/70 border border-pink-500/20 text-[var(--pink-600)] text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full shadow-md backdrop-blur-md mb-6">
            <span className="badge-dot w-2 h-2 rounded-full bg-[var(--pink-500)] animate-pulse-dot" />
            Handmade · FSD Based · Black Luxury Boxes
          </div>

          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-extrabold text-[var(--dark-2)] leading-[1.15] tracking-tight mb-6">
            <span className="bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] bg-clip-text text-transparent">Boxes Made</span>
            <br />
            with <span className="font-dancing text-pink-500 font-bold block sm:inline mt-2">Love</span>
          </h1>

          <p className="text-[var(--text-mid)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Sometimes the words written on the box mean more than the gift inside...... 💕
            <span className="block text-sm font-semibold mt-3 text-[var(--pink-600)]">
              📸 Visit our Instagram{" "}
              <a
                href="https://instagram.com/box.love.pk"
                target="_blank"
                rel="noreferrer"
                className="underline hover:opacity-85"
              >
                highlights section
              </a>{" "}
              to get more ideas!
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="bg-white/50 backdrop-blur-sm border border-pink-100 rounded-2xl px-6 py-3 min-w-[110px]">
              <div className="text-2xl font-bold text-[var(--pink-600)]">100+</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-light)] font-bold">Happy Customers</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-pink-100 rounded-2xl px-6 py-3 min-w-[110px]">
              <div className="text-2xl font-bold text-yellow-600">5★</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-light)] font-bold">Rating</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-pink-100 rounded-2xl px-6 py-3 min-w-[110px]">
              <div className="text-2xl font-bold text-[var(--dark-2)]">🖤</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-light)] font-bold">Black & Gold / Silver</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href="#builder"
              className="w-full sm:w-auto bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white px-8 py-3.5 rounded-2xl text-sm font-bold tracking-wider shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-center"
            >
              ✨ Build Your Box
            </a>
            <a
              href="#showcase"
              className="w-full sm:w-auto bg-white/70 border border-pink-100 text-[var(--text-mid)] px-8 py-3.5 rounded-2xl text-sm font-bold tracking-wider hover:bg-white/95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-center"
            >
              See Our Work →
            </a>
          </div>
        </div>
      </section>

      {/* ========== SHOWCASE SECTION ========== */}
      <section id="showcase" className="py-24 px-6 max-w-7xl mx-auto z-10 relative bg-white rounded-3xl shadow-2xl shadow-pink-600/5 my-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            💝 Our Collection
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-[var(--dark-2)]">
            Boxes Made with <span className="font-dancing text-pink-500 text-4xl block sm:inline">Love</span>
          </h2>
          <p className="text-[var(--text-mid)] text-sm sm:text-base mt-3">
            Every box is a black luxury keepsake with golden or silver handwritten messages — real boxes, real feelings, real love. 🖤✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className="box-card bg-white border border-pink-100 rounded-3xl p-5 shadow-lg shadow-pink-500/5 group hover:shadow-pink-500/15 transition-all duration-300"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[var(--pink-600)] font-bold text-[10px] uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md z-10">
                  {item.badge}
                </span>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="card-info">
                <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)] mb-2 group-hover:text-[var(--pink-500)] transition-all">
                  {item.title}
                </h3>
                <p className="text-[var(--text-mid)] text-xs sm:text-sm leading-relaxed">
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
      <section id="builder" className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            🎁 Make Your Own
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-[var(--dark-2)]">
            Build Your <span className="text-[var(--pink-500)]">Custom Box</span>
          </h2>
          <p className="text-[var(--text-mid)] text-sm sm:text-base mt-3">
            Choose your order type, personalise, and see your box come to life in real-time! 🖤✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Builder Options - Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Step 1: Order Type */}
            <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-500/5">
              <div className="flex gap-4 mb-6 items-start">
                <div className="w-8 h-8 rounded-full bg-[var(--pink-500)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-[var(--dark-2)]">
                    Choose Your Order Type
                  </h3>
                  <p className="text-[var(--text-light)] text-xs sm:text-sm">
                    Just a box, or a personalised masterpiece?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Simple Card */}
                <button
                  type="button"
                  onClick={() => setOrderType("simple")}
                  className={`relative border text-left rounded-2xl p-5 cursor-pointer transition-all duration-300 focus:outline-none ${
                    orderType === "simple"
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-2 ring-[var(--pink-200)]"
                      : "border-pink-100 bg-white hover:border-pink-300"
                  }`}
                >
                  {orderType === "simple" && (
                    <span className="absolute top-3 right-3 bg-[var(--pink-500)] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <span className="text-3xl block mb-2">🖤</span>
                  <div className="font-bold text-sm text-[var(--dark-2)] mb-1">
                    Simple Black Box
                  </div>
                  <div className="text-[var(--text-mid)] text-xs leading-relaxed mb-3">
                    Just the premium black box with delivery. Add optional lights or ribbon.
                  </div>
                  <div className="font-bold text-[var(--pink-600)] text-xs sm:text-sm">
                    Rs. 1,600 + DC
                  </div>
                </button>

                {/* Personalised Card */}
                <button
                  type="button"
                  onClick={() => setOrderType("custom")}
                  className={`relative border text-left rounded-2xl p-5 cursor-pointer transition-all duration-300 focus:outline-none ${
                    orderType === "custom"
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-2 ring-[var(--pink-200)]"
                      : "border-pink-100 bg-white hover:border-pink-300"
                  }`}
                >
                  {orderType === "custom" && (
                    <span className="absolute top-3 right-3 bg-[var(--pink-500)] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <span className="text-3xl block mb-2">✍️</span>
                  <div className="font-bold text-sm text-[var(--dark-2)] mb-1">
                    Personalised Box
                  </div>
                  <div className="text-[var(--text-mid)] text-xs leading-relaxed mb-3">
                    Write your message in golden or silver ink on top and/or inside the box.
                  </div>
                  <div className="font-bold text-[var(--pink-600)] text-xs sm:text-sm">
                    Rs. 1,600 + writing
                  </div>
                </button>
              </div>

              {orderType === "simple" && (
                <div className="bg-pink-50/20 border border-pink-100/50 rounded-2xl p-4 mt-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black border border-pink-200/20 shrink-0" />
                  <div className="grow">
                    <strong className="block text-xs sm:text-sm text-[var(--dark-2)]">
                      🖤 Simple Black Luxury Box
                    </strong>
                    <span className="text-[var(--text-light)] text-[11px]">
                      Clean, elegant — ready for your gift. Add lights or ribbon below.
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs font-bold text-[var(--pink-600)]">Rs. 1,600</span>
                    <span className="text-[10px] text-[var(--text-light)]">Base Price</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Personalisation (Custom only) */}
            {orderType === "custom" && (
              <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-500/5">
                <div className="flex gap-4 mb-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-[var(--pink-500)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg sm:text-xl font-bold text-[var(--dark-2)]">
                      Write Your Messages
                    </h3>
                    <p className="text-[var(--text-light)] text-xs sm:text-sm">
                      Type and watch your words appear live on the box →
                    </p>
                  </div>
                </div>

                {/* Ink Color Selection */}
                <div className="mb-6">
                  <div className="text-xs sm:text-sm font-bold text-[var(--dark-2)] mb-3">
                    🖊️ Choose Ink Colour
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Gold Ink Option */}
                    <label
                      className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer hover:border-pink-300 transition-colors ${
                        inkColor === "gold"
                          ? "border-[var(--pink-500)] bg-[var(--pink-50)]/20"
                          : "border-pink-100 bg-white"
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
                      <div className="w-8 h-8 rounded-lg bg-[#F0C97A] border border-black/10 flex items-center justify-center text-xs font-bold text-black/70 shadow-sm">
                        Au
                      </div>
                      <div>
                        <span className="block font-bold text-xs sm:text-sm text-[var(--dark-2)]">
                          Golden
                        </span>
                        <span className="text-[10px] text-[var(--text-light)]">Golden Ink</span>
                      </div>
                    </label>

                    {/* Silver Ink Option */}
                    <label
                      className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer hover:border-pink-300 transition-colors ${
                        inkColor === "silver"
                          ? "border-[var(--pink-500)] bg-[var(--pink-50)]/20"
                          : "border-pink-100 bg-white"
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
                      <div className="w-8 h-8 rounded-lg bg-[#E0EAF5] border border-black/10 flex items-center justify-center text-xs font-bold text-black/70 shadow-sm">
                        Ag
                      </div>
                      <div>
                        <span className="block font-bold text-xs sm:text-sm text-[var(--dark-2)]">
                          Silver
                        </span>
                        <span className="text-[10px] text-[var(--text-light)]">Silver Ink</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Top of Box Message */}
                <div className="border border-pink-100 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={toggleTopMsg}
                      className="flex items-center gap-3 text-left focus:outline-none font-bold text-xs sm:text-sm text-[var(--dark-2)]"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] text-white transition-all ${
                          hasTopMsg
                            ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                            : "border-pink-200 bg-white"
                        }`}
                      >
                        {hasTopMsg && "✓"}
                      </div>
                      ✍️ Write on Top of Box
                    </button>
                    <span className="text-xs font-bold text-[var(--pink-500)] bg-[var(--pink-50)] px-2.5 py-1 rounded-full shadow-inner">
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
                    placeholder={hasTopMsg ? "Write something beautiful..." : "Enable writing first"}
                    className="w-full bg-pink-50/10 border border-pink-100 focus:border-[var(--pink-300)] focus:ring-1 focus:ring-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none text-[var(--dark-2)] disabled:opacity-50 disabled:bg-zinc-50"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-[var(--text-light)]">
                      {topText.length} / 200 chars
                    </span>
                    {hasTopMsg && topText.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSaveText("top")}
                        className={`text-[10px] font-bold py-1 px-3 rounded-full transition-all ${
                          isSavedMsgTop
                            ? "bg-green-500 text-white"
                            : "bg-[var(--pink-500)] hover:bg-[var(--pink-600)] text-white"
                        }`}
                      >
                        {isSavedMsgTop ? "✅ Saved!" : "💾 Save Message"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Inside of Box Message */}
                <div className="border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={toggleInsideMsg}
                      className="flex items-center gap-3 text-left focus:outline-none font-bold text-xs sm:text-sm text-[var(--dark-2)]"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] text-white transition-all ${
                          hasInsideMsg
                            ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                            : "border-pink-200 bg-white"
                        }`}
                      >
                        {hasInsideMsg && "✓"}
                      </div>
                      📖 Also Write Inside the Box
                    </button>
                    <span className="text-xs font-bold text-[var(--pink-500)] bg-[var(--pink-50)] px-2.5 py-1 rounded-full shadow-inner">
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
                    placeholder={hasInsideMsg ? "Write your inside message here..." : "Enable writing first"}
                    className="w-full bg-pink-50/10 border border-pink-100 focus:border-[var(--pink-300)] focus:ring-1 focus:ring-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none text-[var(--dark-2)] disabled:opacity-50 disabled:bg-zinc-50"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-[var(--text-light)]">
                      {insideText.length} / 400 chars
                    </span>
                    {hasInsideMsg && insideText.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSaveText("inside")}
                        className={`text-[10px] font-bold py-1 px-3 rounded-full transition-all ${
                          isSavedMsgInside
                            ? "bg-green-500 text-white"
                            : "bg-[var(--pink-500)] hover:bg-[var(--pink-600)] text-white"
                        }`}
                      >
                        {isSavedMsgInside ? "✅ Saved!" : "💾 Save Message"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Add-ons */}
            <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-500/5">
              <div className="flex gap-4 mb-6 items-start">
                <div className="w-8 h-8 rounded-full bg-[var(--pink-500)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-[var(--dark-2)]">
                    Optional Add-ons
                  </h3>
                  <p className="text-[var(--text-light)] text-xs sm:text-sm">
                    Make it even more magical ✨
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fairy Lights Card */}
                <button
                  type="button"
                  onClick={() => setAddons((prev) => ({ ...prev, fairy: !prev.fairy }))}
                  className={`flex items-center gap-4 border text-left rounded-2xl p-4.5 cursor-pointer transition-all duration-300 focus:outline-none ${
                    addons.fairy
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-1 ring-[var(--pink-300)]"
                      : "border-pink-100 bg-white hover:border-pink-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] text-white shrink-0 transition-all ${
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
                  <div className="font-bold text-[var(--pink-600)] text-xs sm:text-sm shrink-0">
                    + Rs. 300
                  </div>
                </button>

                {/* Ribbon Bow Card */}
                <button
                  type="button"
                  onClick={() => setAddons((prev) => ({ ...prev, ribbon: !prev.ribbon }))}
                  className={`flex items-center gap-4 border text-left rounded-2xl p-4.5 cursor-pointer transition-all duration-300 focus:outline-none ${
                    addons.ribbon
                      ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-1 ring-[var(--pink-300)]"
                      : "border-pink-100 bg-white hover:border-pink-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] text-white shrink-0 transition-all ${
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
                  <div className="font-bold text-[var(--pink-600)] text-xs sm:text-sm shrink-0">
                    + Rs. 100
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel & Cart Summary - Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* LIVE PREVIEW CONTAINER */}
            <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xl shadow-pink-500/5">
              <div className="flex bg-[var(--pink-50)] p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setPreviewTab("top")}
                  className={`flex-1 font-bold text-[11px] sm:text-xs py-2 rounded-lg transition-all ${
                    previewTab === "top"
                      ? "bg-white text-[var(--pink-600)] shadow-sm"
                      : "text-[var(--text-light)]"
                  }`}
                >
                  Box Top
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
                  className={`flex-1 font-bold text-[11px] sm:text-xs py-2 rounded-lg transition-all ${
                    orderType === "custom" && hasInsideMsg ? "opacity-100" : "opacity-35"
                  } ${
                    previewTab === "inside"
                      ? "bg-white text-[var(--pink-600)] shadow-sm"
                      : "text-[var(--text-light)]"
                  }`}
                >
                  Inside
                </button>
              </div>

              {orderType === "simple" ? (
                /* Simple box preview display */
                <div className="flex flex-col items-center justify-center min-h-[180px] bg-zinc-50 border border-zinc-100 rounded-xl p-5">
                  <span className="text-5xl mb-3 animate-[floatIcon_3s_ease-in-out_infinite]">🖤</span>
                  <span className="font-dancing text-sm text-[var(--pink-500)] font-semibold italic text-center">
                    Simple Luxury Black Box
                  </span>
                </div>
              ) : (
                /* Custom box preview mockup */
                <div className="relative">
                  {/* Top pane view */}
                  {previewTab === "top" ? (
                    <div className="box-face-flat">
                      <div className="absolute top-3 left-3 bg-white/15 border border-white/10 backdrop-blur-sm rounded-lg px-2.5 py-0.5 text-[9px] font-bold text-white/70 uppercase tracking-widest">
                        Top of Box
                      </div>
                      <div className="relative text-center p-6 w-full z-10">
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
                            {hasTopMsg
                              ? "Start typing your top message... ✨"
                              : 'Enable "Write on Top" above to preview ✨'}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Inside pane view */
                    <div className="box-face-flat box-face-inside">
                      <div className="absolute top-3 left-3 bg-white/15 border border-white/10 backdrop-blur-sm rounded-lg px-2.5 py-0.5 text-[9px] font-bold text-white/70 uppercase tracking-widest">
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
            <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-xl shadow-pink-500/5">
              <div className="flex items-center justify-between mb-5">
                <div className="font-playfair font-bold text-lg text-[var(--dark-2)] flex items-center gap-2">
                  <span>🛒</span> Your Order
                </div>
                <div className="bg-[var(--pink-50)] text-[var(--pink-600)] font-bold text-[10px] uppercase tracking-wider py-1 px-3.5 rounded-full shadow-inner">
                  {orderType === "simple" ? "1 Item" : "Personalised"}
                </div>
              </div>

              <div className="flex flex-col gap-3.5 mb-5 text-sm">
                <div className="flex justify-between items-center text-[var(--text-mid)]">
                  <span>🖤 Black Luxury Box</span>
                  <span className="font-semibold">Rs. 1,600</span>
                </div>

                {orderType === "custom" && hasTopMsg && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>✍️ Writing on Top ({inkColor === "silver" ? "Silver" : "Gold"})</span>
                    <span className="font-semibold">Rs. 300</span>
                  </div>
                )}

                {orderType === "custom" && hasInsideMsg && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>📖 Writing Inside ({inkColor === "silver" ? "Silver" : "Gold"})</span>
                    <span className="font-semibold">Rs. 300</span>
                  </div>
                )}

                {addons.fairy && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>🌟 Fairy Lights</span>
                    <span className="font-semibold">Rs. 300</span>
                  </div>
                )}

                {addons.ribbon && (
                  <div className="flex justify-between items-center text-[var(--text-mid)]">
                    <span>🎀 Ribbon &amp; Bow</span>
                    <span className="font-semibold">Rs. 100</span>
                  </div>
                )}

                <div className="h-px bg-pink-100/60 my-1" />

                <div className="flex justify-between items-center text-[var(--text-mid)]">
                  <span>📦 Delivery Charges</span>
                  <span className="font-bold text-[var(--pink-600)]">Rs. 400</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-pink-100 pt-4 mb-5">
                <span className="font-bold text-base text-[var(--dark-2)]">Total</span>
                <span className="font-playfair font-extrabold text-2xl text-[var(--pink-600)]">
                  Rs. {calculateTotal().toLocaleString()}
                </span>
              </div>

              <div className="bg-[var(--pink-50)]/40 border border-pink-100/60 rounded-2xl p-4 text-xs text-stone-700 leading-relaxed mb-6">
                💳 <strong>Advance payment via JazzCash required.</strong> Order confirms **ONLY** after
                you send the payment receipt screenshot on Instagram DM! 📸
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white py-4 rounded-2xl text-center font-bold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 hover:-translate-y-0.5 transition-all duration-300"
              >
                Place Order →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRICING TABLE SECTION ========== */}
      <section id="pricing" className="py-24 px-6 max-w-4xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Price Breakdown
          </div>
          <h2 className="font-playfair text-3xl font-extrabold text-[var(--dark-2)]">
            What's <span className="text-[var(--pink-500)]">Included</span>
          </h2>
          <p className="text-[var(--text-mid)] text-sm mt-3">
            Clear, honest pricing — no hidden charges
          </p>
        </div>

        <div className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-xl shadow-pink-500/5">
          <div className="flex justify-between items-center bg-gradient-to-r from-[var(--pink-50)] to-[#FFFFFF] p-4.5 font-bold text-xs uppercase tracking-wider text-[var(--text-mid)] border-b border-pink-100">
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
              className={`flex justify-between items-center px-6 py-4.5 text-sm border-b border-pink-50/50 last:border-none ${
                row.highlight ? "bg-[var(--pink-50)]/50" : ""
              }`}
            >
              <span className="font-medium text-[var(--dark-2)] flex flex-wrap items-center gap-2">
                {row.name}
                <span className="text-[9px] font-bold text-[var(--text-light)] border border-pink-200/50 bg-white px-2 py-0.5 rounded-full">
                  {row.label}
                </span>
              </span>
              <span className="font-bold text-[var(--text-mid)]">{row.price}</span>
            </div>
          ))}

          <div className="flex justify-between items-center bg-[var(--pink-100)]/40 px-6 py-5 border-t border-pink-200/50">
            <span className="font-bold text-sm sm:text-base text-[var(--pink-600)]">
              Simple Box (Min Order)
            </span>
            <span className="font-playfair font-extrabold text-lg sm:text-xl text-[var(--dark-2)]">
              Rs. 2,000
            </span>
          </div>
        </div>
      </section>

      {/* ========== PAYMENT & GUIDE SECTION ========== */}
      <section id="payment" className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            How to Order
          </div>
          <h2 className="font-playfair text-3xl font-extrabold text-[var(--dark-2)]">
            Simple <span className="text-[var(--pink-500)]">Payment</span> Process
          </h2>
          <p className="text-[var(--text-mid)] text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Advance payment is required. Order confirms **ONLY** after you send the payment receipt
            screenshot on Instagram DM! 📸💕
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* JazzCash Info Block */}
          <div className="bg-gradient-to-br from-white to-[var(--pink-50)]/30 border border-pink-100 rounded-3xl p-6 sm:p-10 max-w-xl w-full mx-auto shadow-xl shadow-pink-500/5">
            <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)] mb-4 text-center">
              JazzCash
            </h3>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-6 text-center">
              Send your advance payment via JazzCash to the number below. Confirm the account name
              matches before executing the transaction. 🟢
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center bg-white border border-pink-100 rounded-2xl px-5 py-4 shadow-sm">
                <span className="text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider">
                  Number
                </span>
                <span className="font-playfair font-extrabold text-lg text-[var(--pink-600)] tracking-widest">
                  0300-6600178
                </span>
              </div>
              <div className="flex justify-between items-center bg-white border border-pink-100 rounded-2xl px-5 py-4 shadow-sm">
                <span className="text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider">
                  Account Name
                </span>
                <span className="font-playfair font-extrabold text-sm sm:text-base text-[var(--dark-2)] tracking-wide">
                  NAZI YAQOOB
                </span>
              </div>
            </div>

            <div className="bg-white/95 border border-pink-100 rounded-2xl p-4 text-xs text-stone-700 leading-relaxed shadow-sm">
              ✅ <strong className="text-[var(--pink-600)]">Confirmation tip:</strong> When you enter
              the number in JazzCash, the name <strong className="text-[var(--pink-500)]">NAZI YAQOOB</strong>{" "}
              will display automatically — verifying you've entered the correct account.
            </div>
          </div>

          {/* Steps List */}
          <div className="w-full bg-white border border-pink-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-pink-500/5">
            <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)] mb-8 text-center">
              🎀 How Your Order Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                "Build your box above, write your message & check your order total (includes Rs. 400 delivery).",
                "Open JazzCash, send the exact total to 0300-6600178. Confirm Nazi Yaqoob displays as the name.",
                "Take a screenshot of the JazzCash receipt and send it via Instagram DM to @box.love.pk",
                "Once verified, your order confirms and goes into handmade production. No refund after confirmation.",
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col gap-4 relative">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--pink-50)] text-[var(--pink-500)] flex items-center justify-center font-bold text-lg shadow-inner">
                    0{idx + 1}
                  </div>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER SECTION ========== */}
      <footer className="bg-[#FFF0F4]/60 border-t border-pink-100/60 py-12 px-6 text-center text-xs sm:text-sm relative z-10">
        <span className="font-dancing text-2xl font-bold text-[var(--pink-500)] tracking-wide block mb-3">
          box.love.pk
        </span>
        <p className="text-[var(--text-mid)] font-medium max-w-md mx-auto mb-2.5 leading-relaxed">
          Customized Black Luxury Boxes with Golden &amp; Silver Writing ♥ Handmade in Faisalabad, Pakistan
        </p>
        <p className="text-[var(--text-light)]">
          <a
            href="https://instagram.com/box.love.pk"
            target="_blank"
            rel="noreferrer"
            className="underline font-bold hover:text-[var(--pink-500)]"
          >
            @box.love.pk
          </a>{" "}
          · Advance payment only · No refund after order confirmation
        </p>
        <p className="text-[var(--text-light)] opacity-60 text-[10px] mt-6">
          © 2026 box.love.pk — All Rights Reserved
        </p>
      </footer>

      {/* ========== CHECKOUT MODAL ========== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-[modalFadeIn_0.3s_ease-out_forwards]">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 animate-[modalSlideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
            <button
              onClick={() => {
                setModalOpen(false);
                setCheckoutStep("form");
              }}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 p-2 text-lg focus:outline-none"
              aria-label="Close modal"
            >
              ✕
            </button>

            {checkoutStep === "form" ? (
              /* --- Step 1: Checkout Form --- */
              <form onSubmit={handleSubmitCheckout} className="space-y-6">
                <div className="text-center border-b border-pink-100 pb-4">
                  <span className="font-dancing text-2xl font-bold text-[var(--pink-500)]">
                    box.love.pk
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)] mt-1">
                    Checkout Summary
                  </h3>
                </div>

                {/* Collapsible Order Summary */}
                <div className="border border-pink-100 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSummaryOpen(!summaryOpen)}
                    className="w-full flex justify-between items-center bg-pink-50/35 px-4 py-3 text-xs font-bold text-[var(--text-mid)] focus:outline-none"
                  >
                    <span>{summaryOpen ? "▼ Hide" : "▶ Show"} Order Summary</span>
                    <span className="text-[var(--pink-600)]">
                      Rs. {calculateTotal().toLocaleString()}
                    </span>
                  </button>

                  {summaryOpen && (
                    <div className="p-4 bg-white border-t border-pink-50 text-xs space-y-2.5">
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
                      <div className="flex justify-between font-semibold">
                        <span>Shipping (Faisalabad Standard)</span>
                        <span>Rs. 400</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    Contact Details
                  </h4>
                  <input
                    type="email"
                    id="chk-email"
                    required
                    placeholder="Email Address"
                    value={formInputs.email}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] focus:ring-1 focus:ring-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none"
                  />
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      id="chk-newsletter"
                      checked={formInputs.newsletter}
                      onChange={handleInputChange}
                      className="accent-[var(--pink-500)]"
                    />
                    <span>Email me with news and special offers</span>
                  </label>
                </div>

                {/* Delivery Address Section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    Delivery Address
                  </h4>
                  <select
                    id="chk-country"
                    value={formInputs.country}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none bg-white"
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
                      className="border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none"
                    />
                    <input
                      type="text"
                      id="chk-lname"
                      required
                      placeholder="Last name"
                      value={formInputs.lname}
                      onChange={handleInputChange}
                      className="border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    id="chk-address"
                    required
                    placeholder="Address"
                    value={formInputs.address}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none"
                  />

                  <input
                    type="text"
                    id="chk-apartment"
                    placeholder="Apartment, suite, unit (optional)"
                    value={formInputs.apartment}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      id="chk-city"
                      required
                      placeholder="City"
                      value={formInputs.city}
                      onChange={handleInputChange}
                      className="border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none"
                    />
                    <input
                      type="text"
                      id="chk-postal"
                      placeholder="Postal Code (optional)"
                      value={formInputs.postal}
                      onChange={handleInputChange}
                      className="border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none"
                    />
                  </div>

                  <input
                    type="tel"
                    id="chk-phone"
                    required
                    placeholder="Mobile Number (e.g. 03xx-xxxxxxx)"
                    value={formInputs.phone}
                    onChange={handleInputChange}
                    className="w-full border border-pink-100 focus:border-[var(--pink-300)] rounded-xl p-3 text-sm focus:outline-none"
                  />

                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      id="chk-saveInfo"
                      checked={formInputs.saveInfo}
                      onChange={handleInputChange}
                      className="accent-[var(--pink-500)]"
                    />
                    <span>Save this information for next time</span>
                  </label>
                </div>

                {/* Shipping Method display */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    Shipping Method
                  </h4>
                  <div className="flex justify-between items-center bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-semibold">
                    <span className="text-stone-700">Standard Delivery (Pakistan)</span>
                    <span className="text-[var(--pink-600)]">Rs. 400</span>
                  </div>
                </div>

                {/* Payment method info */}
                <div className="space-y-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    Payment Info
                  </h4>
                  <div className="border border-pink-100 rounded-2xl overflow-hidden">
                    <div className="flex justify-between items-center bg-pink-50/20 px-4 py-3 text-sm font-bold text-stone-700 border-b border-pink-50">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[var(--pink-500)]" />
                        <span>Advance Payment (JazzCash)</span>
                      </div>
                      <span>🔒 Secure</span>
                    </div>
                    <div className="p-4 bg-white text-xs text-stone-700 space-y-1.5">
                      <p>
                        Advance payment only via JazzCash to <strong>0300-6600178</strong> (Account Name:{" "}
                        <strong>NAZI YAQOOB</strong>).
                      </p>
                      <p className="text-red-600 font-semibold">
                        ❌ Cash on Delivery (COD) is not available.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[var(--pink-500)] to-[var(--pink-600)] text-white py-4 rounded-2xl text-center font-bold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 transition-all duration-300"
                >
                  {isSubmitting ? "⏳ Processing Order..." : "Complete Order →"}
                </button>
              </form>
            ) : (
              /* --- Step 2: Post-Checkout Confirmation --- */
              <div className="space-y-6 text-center animate-[successBounce_0.4s_ease-out_forwards]">
                <div className="text-5xl">🎁</div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[var(--dark-2)]">
                  Order Placed!
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong className="text-[var(--pink-600)]">{formInputs.fname}</strong>!
                  Your order is received.
                  <strong className="block text-[var(--pink-600)] mt-3.5">
                    ⚠️ Note: Your order confirms ONLY after you send the payment receipt screenshot on
                    Instagram DM! 📸
                  </strong>
                </p>

                {/* JazzCash Info Box */}
                <div className="bg-gradient-to-br from-white to-[var(--pink-50)]/30 border border-pink-100 rounded-2xl p-5 text-left text-xs space-y-2.5">
                  <div className="font-bold text-[var(--pink-500)] text-sm border-b border-pink-100 pb-2">
                    JazzCash Account details:
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-light)]">Number</span>
                    <strong className="text-sm tracking-wider text-[var(--pink-600)]">0300-6600178</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-light)]">Account Name</span>
                    <strong className="text-stone-800">NAZI YAQOOB</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-light)]">Amount to Send</span>
                    <strong className="text-sm text-[var(--pink-600)]">
                      Rs. {calculateTotal().toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Instagram Direct Link */}
                <div className="bg-pink-50/20 border border-pink-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                  <span className="text-2xl">📸</span>
                  <strong className="text-xs sm:text-sm text-[var(--pink-600)] block">
                    Send Payment Screenshot
                  </strong>
                  <p className="text-stone-700 text-[11px] leading-relaxed">
                    Take a screenshot of your successful transaction receipt and send it to us on Instagram
                    so we can confirm your order immediately! 💕
                  </p>
                  <a
                    href="https://instagram.com/box.love.pk"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C2336A] to-[#9B2452] text-white py-2.5 px-6 rounded-full font-bold text-xs shadow-lg shadow-pink-600/35 hover:-translate-y-0.5 transition-all mt-1"
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
