"use client";

import React, { useState, useEffect, useMemo } from "react";

interface OrderItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  boxType: string;
  inkColor: string;
  topText: string;
  insideText: string;
  addons: string;
  total: string;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt: string;
}

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState({
    totalCount: 0,
    totalRevenue: 0,
    pendingCount: 0,
    confirmedCount: 0,
    shippedCount: 0,
    cancelledCount: 0,
    customCount: 0,
    simpleCount: 0,
  });

  // Attempt to load passcode from local storage on mount
  useEffect(() => {
    const savedPasscode = localStorage.getItem("admin_passcode");
    if (savedPasscode) {
      setPasscode(savedPasscode);
      setPasscodeInput(savedPasscode);
      fetchOrders(savedPasscode);
    }
  }, []);

  const fetchOrders = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/orders?passcode=${encodeURIComponent(code)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(data.orders || []);
        setIsAuthenticated(true);
        localStorage.setItem("admin_passcode", code);
        setPasscode(code);
      } else {
        setError(data.error || "Authentication failed.");
        setIsAuthenticated(false);
        localStorage.removeItem("admin_passcode");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to connect to server.");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) {
      setError("Please enter a passcode.");
      return;
    }
    fetchOrders(passcodeInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_passcode");
    setPasscode("");
    setPasscodeInput("");
    setIsAuthenticated(false);
    setOrders([]);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/admin/orders?passcode=${encodeURIComponent(passcode)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus as any } : ord))
        );
        // Update selected order modal if open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        alert(data.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Recalculate stats when orders list changes
  useEffect(() => {
    let rev = 0;
    let pend = 0;
    let conf = 0;
    let ship = 0;
    let canc = 0;
    let custom = 0;
    let simple = 0;

    orders.forEach((ord) => {
      // Parse total amount (e.g. "2,600" -> 2600)
      const numericVal = parseFloat(ord.total.replace(/,/g, "")) || 0;
      if (ord.status !== "cancelled") {
        rev += numericVal;
      }

      if (ord.status === "pending") pend++;
      else if (ord.status === "confirmed") conf++;
      else if (ord.status === "shipped") ship++;
      else if (ord.status === "cancelled") canc++;

      if (ord.boxType.toLowerCase().includes("personalised") || ord.boxType.toLowerCase().includes("custom")) {
        custom++;
      } else {
        simple++;
      }
    });

    setStats({
      totalCount: orders.length,
      totalRevenue: rev,
      pendingCount: pend,
      confirmedCount: conf,
      shippedCount: ship,
      cancelledCount: canc,
      customCount: custom,
      simpleCount: simple,
    });
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesSearch =
        ord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.boxType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || ord.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9FA] px-4 font-sans-inter">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-300/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-200/20 rounded-full filter blur-3xl" />

        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-pink-900/5 border border-pink-100/60 p-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-dancing text-4xl font-extrabold text-[#E03E6D] mb-1">
              box.love.pk
            </h1>
            <p className="text-[#854E62] text-sm font-medium">Administrator Control Vault</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="passcode" className="block text-xs font-semibold text-[#3D202C] uppercase tracking-wider mb-2">
                Enter Admin Passcode
              </label>
              <div className="relative">
                <input
                  id="passcode"
                  type={showPassword ? "text" : "password"}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#FFF3F6] border border-pink-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E03E6D] text-center tracking-widest font-mono text-lg text-[#3D202C] transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-700 text-sm font-semibold p-1"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#E03E6D] to-[#B5224D] text-white rounded-xl font-bold shadow-lg shadow-pink-600/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Unlock Vault"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Main View
  return (
    <div className="min-h-screen bg-[#FFF9FA] text-[#3D202C] font-sans-inter">
      {/* HEADER Nav */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100/60 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-dancing text-2xl font-black text-[#E03E6D]">
            box.love.pk
          </span>
          <span className="bg-[#FFF3F6] text-[#E03E6D] text-xs font-bold px-2.5 py-1 rounded-full border border-pink-100">
            Admin Vault
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchOrders(passcode)}
            disabled={loading}
            className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg border border-pink-100 transition-all flex items-center justify-center"
            title="Refresh Orders"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18"
              />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold border border-rose-150 rounded-xl transition-all cursor-pointer"
          >
            Lock Vault
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* STATS HIGHLIGHT */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100/50 flex flex-col justify-between">
            <span className="text-xs font-bold text-[#854E62] uppercase tracking-wider">Total Sales</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E03E6D] mt-2">
              Rs. {stats.totalRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#B07D93] mt-1 font-medium">Excluding cancelled orders</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100/50 flex flex-col justify-between">
            <span className="text-xs font-bold text-[#854E62] uppercase tracking-wider">Total Orders</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#3D202C] mt-2">
              {stats.totalCount}
            </span>
            <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-[#854E62]">
              <span className="text-yellow-600">{stats.pendingCount} Pending</span>
              <span>•</span>
              <span className="text-emerald-600">{stats.shippedCount} Shipped</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100/50 flex flex-col justify-between">
            <span className="text-xs font-bold text-[#854E62] uppercase tracking-wider">Lid Customizations</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#3D202C] mt-2">
              {stats.customCount}
            </span>
            <span className="text-[10px] text-[#B07D93] mt-1 font-medium">
              {stats.simpleCount} Plain black boxes
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100/50 flex flex-col justify-between">
            <span className="text-xs font-bold text-[#854E62] uppercase tracking-wider">Active Queue</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">
              {stats.pendingCount + stats.confirmedCount}
            </span>
            <span className="text-[10px] text-[#B07D93] mt-1 font-medium">Pending & confirmed</span>
          </div>
        </section>

        {/* FILTERS & SEARCH */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:max-w-md relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name, phone, address, box..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFF3F6] border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E03E6D] text-sm text-[#3D202C] transition-all"
            />
          </div>

          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#854E62] uppercase mr-2 tracking-wider">Filter Status:</span>
            {["all", "pending", "confirmed", "shipped", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                  statusFilter === status
                    ? "bg-[#E03E6D] text-white border-[#E03E6D] shadow-md shadow-pink-500/20"
                    : "bg-white text-[#854E62] border-pink-100 hover:bg-pink-50/50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {/* ORDERS TABLE/GRID */}
        <section className="bg-white rounded-2xl shadow-sm border border-pink-100/50 overflow-hidden">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-pink-200 border-t-[#E03E6D] rounded-full animate-spin" />
              <p className="text-[#854E62] text-sm font-medium">Fetching orders from MongoDB...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-[#854E62]">
              <svg
                className="w-12 h-12 mx-auto text-pink-200 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4h16z"
                />
              </svg>
              <h3 className="font-semibold text-base">No orders found</h3>
              <p className="text-xs text-[#B07D93] mt-1">Try tweaking your search terms or status filters.</p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#FFF3F6] border-b border-pink-100 font-bold text-[#854E62] text-xs uppercase tracking-wider">
                      <th className="py-4 px-5">Date</th>
                      <th className="py-4 px-5">Customer</th>
                      <th className="py-4 px-5">Box Details</th>
                      <th className="py-4 px-5">Total</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-pink-50/20 transition-all group cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="py-4.5 px-5 align-middle text-[#854E62] font-medium text-xs">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4.5 px-5 align-middle">
                          <div className="font-bold text-[#3D202C]">{order.name}</div>
                          <div className="text-xs text-[#854E62] mt-0.5">{order.phone}</div>
                          <div className="text-[10px] text-[#B07D93] max-w-xs truncate" title={order.address}>
                            {order.address}
                          </div>
                        </td>
                        <td className="py-4.5 px-5 align-middle">
                          <div className="font-semibold text-xs flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-black shrink-0" />
                            {order.boxType}
                          </div>
                          {order.inkColor !== "N/A" && (
                            <div className="text-[11px] font-semibold text-[#854E62] mt-1 flex items-center gap-1">
                              Ink:{" "}
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase border ${
                                  order.inkColor === "Golden"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-slate-50 text-slate-700 border-slate-200"
                                }`}
                              >
                                {order.inkColor}
                              </span>
                            </div>
                          )}
                          {order.addons !== "None" && (
                            <div className="text-[10px] text-pink-600 font-medium mt-0.5">
                              Addons: {order.addons}
                            </div>
                          )}
                        </td>
                        <td className="py-4.5 px-5 align-middle font-extrabold text-[#E03E6D]">
                          Rs. {order.total}
                        </td>
                        <td className="py-4.5 px-5 align-middle" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition-all cursor-pointer ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4.5 px-5 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-xs font-bold transition-all border border-pink-100 cursor-pointer"
                          >
                            Details & Preview
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE GRID VIEW */}
              <div className="lg:hidden divide-y divide-pink-50">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-5 space-y-4 hover:bg-pink-50/10 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#B07D93] font-semibold">
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="font-extrabold text-sm text-[#E03E6D]">Rs. {order.total}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#3D202C] text-sm">{order.name}</h4>
                      <p className="text-xs text-[#854E62] font-medium mt-0.5">{order.phone}</p>
                      <p className="text-xs text-[#B07D93] line-clamp-1 mt-1">{order.address}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-[#FFF3F6] border border-pink-100 text-[#854E62] px-2 py-0.5 rounded font-medium">
                        {order.boxType}
                      </span>
                      {order.inkColor !== "N/A" && (
                        <span
                          className={`px-2 py-0.5 rounded font-bold border uppercase text-[9px] ${
                            order.inkColor === "Golden"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          {order.inkColor} Ink
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition-all cursor-pointer ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-xs font-bold border border-pink-100 cursor-pointer"
                      >
                        Preview Design
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* DETAILS & PREVIEW MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-pink-950/20 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-[modalFadeIn_0.2s_ease-out]"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden relative animate-[modalSlideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-pink-50 flex items-center justify-between bg-[#FFF3F6]">
              <div>
                <h3 className="font-extrabold text-lg text-[#3D202C]">Order Details</h3>
                <p className="text-xs text-[#854E62] mt-0.5">ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Split info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-[#3D202C] uppercase tracking-wider border-b border-pink-100 pb-2">
                    Client Details
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div>
                      <div className="text-[10px] text-[#B07D93] uppercase font-bold tracking-wide">Customer Name</div>
                      <div className="font-bold text-[#3D202C] text-base">{selectedOrder.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#B07D93] uppercase font-bold tracking-wide">Phone Number</div>
                      <div className="font-bold text-[#E03E6D] text-base">
                        <a href={`tel:${selectedOrder.phone}`} className="hover:underline">
                          {selectedOrder.phone}
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#B07D93] uppercase font-bold tracking-wide">Email Address</div>
                      <div className="font-medium text-[#854E62]">
                        <a href={`mailto:${selectedOrder.email}`} className="hover:underline">
                          {selectedOrder.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#B07D93] uppercase font-bold tracking-wide">Shipping Address</div>
                      <div className="font-semibold text-[#3D202C] leading-relaxed bg-pink-50/30 p-2.5 rounded-lg border border-pink-100/50 mt-1">
                        {selectedOrder.address}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Box Specifications */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-[#3D202C] uppercase tracking-wider border-b border-pink-100 pb-2">
                    Box Configuration
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div>
                      <div className="text-[10px] text-[#B07D93] uppercase font-bold tracking-wide">Selected Box</div>
                      <div className="font-bold text-[#3D202C] flex items-center gap-1.5 mt-0.5">
                        <span className="w-3 h-3 rounded bg-black inline-block" />
                        {selectedOrder.boxType}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#B07D93] uppercase font-bold tracking-wide">Ink Selection</div>
                      <div className="mt-1">
                        {selectedOrder.inkColor !== "N/A" ? (
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-extrabold border tracking-wider uppercase ${
                              selectedOrder.inkColor === "Golden"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            {selectedOrder.inkColor}
                          </span>
                        ) : (
                          <span className="text-xs text-[#B07D93] font-semibold uppercase">No Custom Ink</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#B07D93] uppercase font-bold tracking-wide">Selected Addons</div>
                      <div className="font-semibold text-[#3D202C] mt-0.5">{selectedOrder.addons}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#B07D93] uppercase font-bold tracking-wide">Pricing Total</div>
                      <div className="text-xl font-black text-[#E03E6D] mt-0.5">Rs. {selectedOrder.total}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Writing Visual Mockups */}
              {(selectedOrder.topText || selectedOrder.insideText) && (
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-extrabold text-[#3D202C] uppercase tracking-wider border-b border-pink-100 pb-2">
                    Visual Design Mockup (Golden/Silver Ink)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top of Box Mockup */}
                    {selectedOrder.topText ? (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-[#854E62] text-center">Top Lid Message Preview</div>
                        <div className="aspect-square w-full max-w-[280px] mx-auto bg-stone-900 border-4 border-stone-800 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                          {/* Box ribbing effect */}
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_80%)]" />
                          <div
                            className={`font-playfair text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap select-all selection:bg-pink-600/30 ${
                              selectedOrder.inkColor === "Golden"
                                ? "text-[#D4A853] drop-shadow-[0_2px_4px_rgba(212,168,83,0.3)] bg-gradient-to-br from-[#FFE08A] via-[#D4A853] to-[#F0C97A] bg-clip-text text-transparent"
                                : "text-[#C8D4E0] drop-shadow-[0_2px_4px_rgba(200,212,224,0.3)] bg-gradient-to-br from-white via-[#C8D4E0] to-slate-300 bg-clip-text text-transparent"
                            }`}
                          >
                            {selectedOrder.topText}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 flex items-center justify-center text-xs text-[#B07D93] text-center aspect-square max-w-[280px] mx-auto">
                        No Lid Message
                      </div>
                    )}

                    {/* Inside Tabs Mockup */}
                    {selectedOrder.insideText ? (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-[#854E62] text-center">Inside Lid Message Preview</div>
                        <div className="aspect-square w-full max-w-[280px] mx-auto bg-stone-900 border-4 border-stone-800 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                          {/* Inner box liner border */}
                          <div className="absolute inset-2.5 border border-stone-850 rounded-lg pointer-events-none" />
                          <div
                            className={`font-dancing text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap select-all selection:bg-pink-600/30 ${
                              selectedOrder.inkColor === "Golden"
                                ? "text-[#D4A853] drop-shadow-[0_2px_4px_rgba(212,168,83,0.3)] bg-gradient-to-br from-[#FFE08A] via-[#D4A853] to-[#F0C97A] bg-clip-text text-transparent"
                                : "text-[#C8D4E0] drop-shadow-[0_2px_4px_rgba(200,212,224,0.3)] bg-gradient-to-br from-white via-[#C8D4E0] to-slate-300 bg-clip-text text-transparent"
                            }`}
                          >
                            {selectedOrder.insideText}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 flex items-center justify-center text-xs text-[#B07D93] text-center aspect-square max-w-[280px] mx-auto">
                        No Inside Message
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-pink-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#854E62] uppercase">Change Status:</span>
                <div className="flex gap-1.5">
                  {["pending", "confirmed", "shipped", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder._id, status)}
                      disabled={updatingId === selectedOrder._id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize border transition-all cursor-pointer ${
                        selectedOrder.status === status
                          ? getStatusColor(status)
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const text = `BOX ORDER DETAIL:\n\n- Name: ${selectedOrder.name}\n- Phone: ${selectedOrder.phone}\n- Address: ${selectedOrder.address}\n- Box Type: ${selectedOrder.boxType}\n- Ink Color: ${selectedOrder.inkColor}\n- Lid Text: ${selectedOrder.topText || "N/A"}\n- Inside Text: ${selectedOrder.insideText || "N/A"}\n- Addons: ${selectedOrder.addons}\n- Total: Rs. ${selectedOrder.total}`;
                    navigator.clipboard.writeText(text);
                    alert("Order details copied to clipboard!");
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-pink-100 hover:bg-pink-50 text-[#E03E6D] text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Copy Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
