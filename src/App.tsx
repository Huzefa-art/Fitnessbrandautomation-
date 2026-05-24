import { useState, useEffect, useRef } from "react";

// --- CONFIGURATION ---
// Set your real n8n or Make.com webhook URL here
export const WEBHOOK_URL = "";

// Set your n8n instance URL to embed the real n8n editor in the right panel
// Example: "http://localhost:5678" or "https://your-org.app.n8n.cloud"
export const N8N_URL = "";

// (Optional) Set a specific workflow ID to open that workflow directly
// Find it in the n8n URL: /workflow/<ID>
export const N8N_WORKFLOW_ID = "";

// Configure your automation workflow nodes here
export const NODES = [
    {
        id: 1,
        label: "Purchase / Opt-in",
        icon: "🛍️",
        desc: "Lead magnet / Store buy",
        color: "#ec4899",
        details: {
            event: "customer.order_created",
            product: "8-Week Strong Body Program",
            value: "$47.00",
            source: "Shopify Storefront",
            platform: "FB/IG Ad"
        }
    },
    {
        id: 2,
        label: "Shopify Sync",
        icon: "📦",
        desc: "Updating customer tags",
        color: "#f43f5e",
        details: {
            customer_id: "7891230482",
            status: "active",
            tags_added: ["WWLW-Strong-8W", "VIP-Nurture"],
            total_spent: "$142.50",
            marketing_consent: "True"
        }
    },
    {
        id: 3,
        label: "ManyChat Trigger",
        icon: "💬",
        desc: "Instagram DM sequence",
        color: "#f59e0b",
        details: {
            psid: "8912304123",
            flow_name: "Post-Purchase Congratulations",
            delivery_status: "sent",
            buttons_clicked: ["Get Workout PDF"],
            subscriber_status: "subscribed"
        }
    },
    {
        id: 4,
        label: "Beehiiv Segments",
        icon: "🏷️",
        desc: "Tagging email list",
        color: "#10b981",
        details: {
            provider: "Beehiiv",
            list: "WWLW Main Newsletter",
            segment: "8-Week Program Buyers",
            welcome_email: "WWLW-Welcome-01",
            open_tracking: "enabled"
        }
    },
    {
        id: 5,
        label: "App Access Issued",
        icon: "📱",
        desc: "Fitness app login",
        color: "#3b82f6",
        details: {
            platform: "Passion.io / Custom App",
            provisioning: "instant",
            access_tier: "Premium",
            reset_link_sent: "true",
            sync_status: "success"
        }
    },
    {
        id: 6,
        label: "Training Drip Start",
        icon: "📅",
        desc: "Scheduling 4 weeks",
        color: "#8b5cf6",
        details: {
            automation: "WWLW-Weekly-Check-in",
            next_email_date: "2026-05-31",
            recurrence: "Weekly x 8",
            staff_alert: "Personal Trainer Assigned",
            priority: "NORMAL"
        }
    },
];

const DELAYS = [0, 800, 1800, 2800, 3800, 4800];
const TIMING_MS = [156, 342, 612, 184, 450, 210];

// Node layout constants for the fake n8n canvas
const NODE_W = 242;
const NODE_H = 74;
const NODE_GAP = 36;
const PAD_TOP = 44;
const PAD_SIDE = 54;
const CANVAS_W = NODE_W + PAD_SIDE * 2;
const CANVAS_H = DELAYS.length * (NODE_H + NODE_GAP) - NODE_GAP + PAD_TOP * 2;
const NODE_X = PAD_SIDE;
const NODE_CENTER_X = PAD_SIDE + NODE_W / 2;
const getNodeY = (i) => PAD_TOP + i * (NODE_H + NODE_GAP);
const getNodeBottomY = (i) => getNodeY(i) + NODE_H;


// =============================================================
// FAKE N8N CANVAS — visual replica of the n8n editor interface
// =============================================================
function FakeN8NCanvas({ nodeStates, running, done, onNodeClick }) {
    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#1b1b2e",
        }}>
            {/* ── n8n-style top toolbar ── */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 14px",
                background: "#13131f",
                borderBottom: "1px solid #25253a",
                flexShrink: 0,
                zIndex: 10,
            }}>
                {/* Left: logo + workflow name */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                        background: "linear-gradient(135deg,#ec4899,#f97316)",
                        borderRadius: "5px",
                        width: 22, height: 22,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 900, color: "#fff",
                        fontFamily: "'IBM Plex Mono', monospace",
                        flexShrink: 0,
                    }}>n</div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#aaaacc", fontWeight: 600 }}>WWLW Brand Automation Hub</span>
                    <div style={{ width: 1, height: 14, background: "#25253a", marginLeft: 2 }} />
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#3d3d5a" }}>Workflow #7</span>
                </div>
                {/* Right: status pills */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {running && (
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#f9731612", border: "1px solid #f9731640", borderRadius: "4px", padding: "3px 10px" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", border: "2px solid #f97316", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#f97316" }}>Executing…</span>
                        </div>
                    )}
                    {done && (
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#10b98112", border: "1px solid #10b98140", borderRadius: "4px", padding: "3px 10px" }}>
                            <span style={{ color: "#10b981", fontSize: "10px" }}>✓</span>
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#10b981" }}>Success · 6.4s</span>
                        </div>
                    )}
                    {!running && !done && (
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#2d2d4a" }}>Waiting for trigger…</span>
                    )}
                    {/* Fake n8n toolbar buttons */}
                    {["⚙", "▶", "⊕"].map((icon, i) => (
                        <div key={i} style={{
                            width: 26, height: 26, borderRadius: "5px",
                            background: "#1e1e30", border: "1px solid #25253a",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "13px", color: "#3d3d5a", cursor: "default",
                        }}>{icon}</div>
                    ))}
                </div>
            </div>

            {/* ── Canvas area ── */}
            <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
                {/* Dot grid */}
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: "radial-gradient(circle, #2a2a42 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }} />

                {/* Centered node canvas */}
                <div style={{
                    position: "relative",
                    width: `${CANVAS_W}px`,
                    height: `${CANVAS_H}px`,
                    margin: "0 auto",
                    minHeight: "100%",
                }}>
                    {/* SVG connector lines */}
                    <svg
                        style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
                        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
                        width={CANVAS_W}
                        height={CANVAS_H}
                    >
                        <defs>
                            {NODES.map((node, i) => (
                                <marker
                                    key={`arrow-${i}`}
                                    id={`arrow-${i}`}
                                    markerWidth="7" markerHeight="7"
                                    refX="3.5" refY="3.5"
                                    orient="auto"
                                >
                                    <polygon
                                        points="0 0, 7 3.5, 0 7"
                                        fill={nodeStates[i] === "done" || nodeStates[i + 1] === "running" ? node.color : "#2a2a42"}
                                        style={{ transition: "fill 0.4s ease" }}
                                    />
                                </marker>
                            ))}
                        </defs>
                        {NODES.map((node, i) => {
                            if (i === NODES.length - 1) return null;
                            const isActive = nodeStates[i] === "done" || nodeStates[i + 1] === "running";
                            const fromY = getNodeBottomY(i);
                            const toY = getNodeY(i + 1);
                            const midY = (fromY + toY) / 2;
                            return (
                                <path
                                    key={`conn-${i}`}
                                    d={`M ${NODE_CENTER_X} ${fromY} C ${NODE_CENTER_X} ${midY}, ${NODE_CENTER_X} ${midY}, ${NODE_CENTER_X} ${toY - 6}`}
                                    fill="none"
                                    stroke={isActive ? node.color : "#2a2a42"}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    strokeDasharray={isActive ? "none" : "5 4"}
                                    markerEnd={`url(#arrow-${i})`}
                                    style={{ transition: "stroke 0.45s ease, stroke-width 0.45s ease" }}
                                />
                            );
                        })}
                    </svg>

                    {/* Node cards */}
                    {NODES.map((node, i) => {
                        const state = nodeStates[i];
                        const isIdle = state === "idle";
                        const isRunning = state === "running";
                        const isDone = state === "done";
                        const y = getNodeY(i);
                        return (
                            <div
                                key={node.id}
                                onClick={isDone ? () => onNodeClick(node) : undefined}
                                title={isDone ? "Click to view execution payload" : undefined}
                                style={{
                                    position: "absolute",
                                    left: NODE_X,
                                    top: y,
                                    width: NODE_W,
                                    height: NODE_H,
                                    background: isDone
                                        ? `linear-gradient(120deg, #1e1e32 60%, ${node.color}14)`
                                        : isRunning ? "#1c1c2e" : "#171726",
                                    border: `1px solid ${isDone ? node.color + "70" : isRunning ? node.color + "50" : "#252538"}`,
                                    borderRadius: "8px",
                                    boxShadow: isDone
                                        ? `0 0 20px ${node.color}20, 0 2px 10px rgba(0,0,0,0.35)`
                                        : isRunning
                                            ? `0 0 28px ${node.color}25`
                                            : "0 2px 8px rgba(0,0,0,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    overflow: "hidden",
                                    cursor: isDone ? "pointer" : "default",
                                    transition: "all 0.4s ease",
                                    opacity: isIdle ? 0.42 : 1,
                                }}
                            >
                                {/* Shimmer sweep when running */}
                                {isRunning && (
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: `linear-gradient(90deg, transparent, ${node.color}18, transparent)`,
                                        animation: "shimmer 1.2s infinite",
                                        pointerEvents: "none",
                                    }} />
                                )}

                                {/* Left color stripe (n8n-style) */}
                                <div style={{
                                    width: "4px",
                                    height: "100%",
                                    background: isDone || isRunning ? node.color : "#252538",
                                    flexShrink: 0,
                                    transition: "background 0.4s ease",
                                }} />

                                {/* Icon badge */}
                                <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "6px",
                                    background: isDone || isRunning ? `${node.color}22` : "#20202e",
                                    border: `1px solid ${isDone || isRunning ? node.color + "45" : "#252538"}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "17px",
                                    margin: "0 12px 0 10px",
                                    flexShrink: 0,
                                    transition: "all 0.4s ease",
                                }}>
                                    {node.icon}
                                </div>

                                {/* Text block */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: isDone ? "#e0e0ff" : isRunning ? "#c0c0e0" : "#383858",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        transition: "color 0.4s ease",
                                    }}>{node.label}</div>
                                    <div style={{
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        fontSize: "10px",
                                        color: isDone || isRunning ? "#44445a" : "#25253a",
                                        marginTop: 2,
                                        transition: "color 0.4s ease",
                                    }}>{node.desc}</div>
                                    {isDone && (
                                        <div style={{
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            fontSize: "9px",
                                            color: "#10b981",
                                            marginTop: 3,
                                            animation: "fadeUp 0.3s ease",
                                        }}>
                                            ✓ 1 item · {TIMING_MS[i]}ms
                                        </div>
                                    )}
                                </div>

                                {/* Status indicator */}
                                <div style={{ marginRight: "12px", flexShrink: 0 }}>
                                    {isDone && (
                                        <div style={{
                                            width: 20, height: 20, borderRadius: "50%",
                                            background: "#10b981",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "11px", color: "#fff",
                                            animation: "popIn 0.3s ease",
                                        }}>✓</div>
                                    )}
                                    {isRunning && (
                                        <div style={{
                                            width: 20, height: 20, borderRadius: "50%",
                                            border: `2px solid ${node.color}`,
                                            borderTopColor: "transparent",
                                            animation: "spin 0.7s linear infinite",
                                        }} />
                                    )}
                                    {isIdle && (
                                        <div style={{
                                            width: 20, height: 20, borderRadius: "50%",
                                            border: "1.5px solid #252538",
                                        }} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// =============================================================
function NodeCard({ node, state, onClick }) {
    const isIdle = state === "idle";
    const isRunning = state === "running";
    const isDone = state === "done";

    return (
        <div
            onClick={isDone ? onClick : undefined}
            className={isDone ? "node-card-interactive" : ""}
            title={isDone ? "Click to view execution details" : undefined}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                border: `1.5px solid ${isDone ? node.color : isRunning ? node.color : "#2a2a3a"}`,
                background: isDone
                    ? `${node.color}18`
                    : isRunning
                        ? `${node.color}10`
                        : "#16162a",
                transition: "all 0.4s ease",
                opacity: isIdle ? 0.4 : 1,
                position: "relative",
                overflow: "hidden",
                cursor: isDone ? "pointer" : "default",
            }}
        >
            {isRunning && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(90deg, transparent, ${node.color}20, transparent)`,
                        animation: "shimmer 1.2s infinite",
                    }}
                />
            )}
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    background: isDone || isRunning ? `${node.color}25` : "#1e1e30",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0,
                    border: `1px solid ${isDone || isRunning ? node.color + "50" : "#2a2a3a"}`,
                }}
            >
                {node.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: isDone ? node.color : isRunning ? node.color : "#555577",
                        letterSpacing: "0.02em",
                    }}
                >
                    {node.label}
                </div>
                <div
                    style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "10px",
                        color: isDone || isRunning ? "#888" : "#333355",
                        marginTop: 2,
                    }}
                >
                    {node.desc}
                </div>
            </div>
            <div style={{ flexShrink: 0 }}>
                {isDone && (
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: node.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            animation: "popIn 0.3s ease",
                        }}
                    >
                        ✓
                    </div>
                )}
                {isRunning && (
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: `2px solid ${node.color}`,
                            borderTopColor: "transparent",
                            animation: "spin 0.7s linear infinite",
                        }}
                    />
                )}
                {isIdle && (
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: "2px solid #2a2a3a",
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function Connector({ active, color }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "28px",
                height: "14px",
                gap: 0,
            }}
        >
            <div
                style={{
                    width: 2,
                    height: "100%",
                    background: active ? color : "#2a2a3a",
                    transition: "background 0.4s ease",
                    borderRadius: 1,
                }}
            />
        </div>
    );
}

export default function App() {
    const [nodeStates, setNodeStates] = useState(NODES.map(() => "idle"));
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", program: "8-Week Strong Body" });
    const [submitted, setSubmitted] = useState(false);
    const [log, setLog] = useState([]);
    const [webhookActive, setWebhookActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activePopupNode, setActivePopupNode] = useState(null);
    const [copiedText, setCopiedText] = useState(false);
    const [rightTab, setRightTab] = useState(N8N_URL ? "n8n" : "animation");
    const [iframeKey, setIframeKey] = useState(0);
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [log]);

    const addLog = (msg, color = "#666") => {
        const time = new Date().toLocaleTimeString("en-US", { hour12: false });
        setLog((prev) => [...prev, { time, msg, color }]);
    };

    const runAutomation = () => {
        setRunning(true);
        setDone(false);
        setLog([]);
        setNodeStates(NODES.map(() => "idle"));

        const logMessages = [
            ["Order created — capturing Shopify metadata", "#ec4899"],
            ["Customer sync — applying VIP & Program tags", "#f43f5e"],
            [`ManyChat → IG DM sequence triggered (Welcome Hook)`, "#f59e0b"],
            ["Beehiiv Segment → Subscribed to '8-Week Strong'", "#10b981"],
            [`App Provisioning → Premium access granted (ID: WWLW-SM)`, "#3b82f6"],
            ["Training Drip → Scheduled 4-week automated sequence", "#8b5cf6"],
        ];

        NODES.forEach((_, i) => {
            setTimeout(() => {
                setNodeStates((prev) => {
                    const next = [...prev];
                    if (i > 0) next[i - 1] = "done";
                    next[i] = "running";
                    return next;
                });
                addLog(logMessages[i][0], logMessages[i][1]);

                if (i === NODES.length - 1) {
                    setTimeout(() => {
                        setNodeStates(NODES.map(() => "done"));
                        setRunning(false);
                        setDone(true);
                        addLog("✅ Fan Onboarding complete — 6 nodes executed in 4.8s", "#10b981");
                    }, 900);
                }
            }, DELAYS[i]);
        });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email) return;

        setIsSubmitting(true);
        setLog([]); // Reset log upon trigger
        addLog("⚡ Submitting lead to pipeline...", "#f97316");

        const payload = {
            name: form.name,
            email: form.email,
            program: form.program || "N/A",
            timestamp: new Date().toISOString(),
            source: "shopify_webhook_v4"
        };

        if (webhookActive) {
            if (WEBHOOK_URL) {
                addLog(`📤 Dispatching POST request to webhook...`, "#8b5cf6");
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second timeout

                    const response = await fetch(WEBHOOK_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (response.ok) {
                        addLog("🟢 Webhook triggered successfully!", "#10b981");
                    } else {
                        addLog(`⚠️ Webhook responded with status ${response.status}`, "#f59e0b");
                    }
                } catch (err) {
                    if (err.name === "AbortError") {
                        addLog("❌ Webhook request timed out after 6 seconds", "#ef4444");
                    } else {
                        addLog(`❌ Webhook failure: ${err.message}`, "#ef4444");
                    }
                }
            } else {
                addLog("⚠️ Webhook toggle is ON but WEBHOOK_URL is not configured at top of file!", "#f59e0b");
                await new Promise((r) => setTimeout(r, 1200));
            }
        } else {
            addLog("ℹ️ Local simulation active (Webhook toggle is OFF)", "#555577");
            await new Promise((r) => setTimeout(r, 800)); // Smooth simulation delay
        }

        setSubmitted(true);
        setIsSubmitting(false);
        // Reload the n8n iframe so the latest execution is visible
        setIframeKey((k) => k + 1);
        setTimeout(() => runAutomation(), 400);
    };

    const handleReset = () => {
        setSubmitted(false);
        setRunning(false);
        setDone(false);
        setNodeStates(NODES.map(() => "idle"));
        setLog([]);
        setForm({ name: "", email: "", program: "8-Week Strong Body" });
        setIsSubmitting(false);
        setCopiedText(false);
        setIframeKey((k) => k + 1);
    };

    const handleExportSummary = () => {
        const timeStr = new Date().toLocaleString();
        const summaryText = `🚀 WWLW Brand Automation Summary
--------------------------------------------------
Timestamp: ${timeStr}
Onboarding Status: SUCCESS ✓
Nodes Executed: ${NODES.length}/${NODES.length}
Total Duration: 4.8s

Customer Onboarded:
- Name: ${form.name || "N/A"}
- Email: ${form.email || "N/A"}
- Program: ${form.program || "N/A"}

Automation Workflow Steps:
${NODES.map(node => `  ${node.icon} [${node.label}] - ${node.desc}`).join("\n")}

Stay Strong! - Women Who Lift Weights
--------------------------------------------------`;

        navigator.clipboard.writeText(summaryText);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0c18; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        input, textarea {
          outline: none;
          background: #0f0f1e;
          border: 1.5px solid #2a2a3a;
          border-radius: 8px;
          color: #e0e0ff;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          padding: 10px 14px;
          width: 100%;
          transition: border-color 0.2s;
        }
        input:focus, textarea:focus {
          border-color: #8b5cf6;
        }
        input::placeholder, textarea::placeholder {
          color: #33334a;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }

        .app-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          min-height: calc(100vh - 61px);
        }
        .left-panel {
          border-right: 1px solid #1a1a2e;
        }
        @media (max-width: 900px) {
          .app-grid {
            grid-template-columns: 1fr;
          }
          .left-panel {
            border-right: none !important;
            border-bottom: 1px solid #1a1a2e;
          }
        }
        .node-card-interactive {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .node-card-interactive:hover {
          transform: translateY(-2px);
          filter: brightness(1.2);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        .right-tab-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.04em;
        }
        .right-tab-btn.active {
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: #fff;
        }
        .right-tab-btn.inactive {
          background: #1a1a2e;
          color: #555577;
        }
        .right-tab-btn.inactive:hover {
          background: #2a2a3e;
          color: #8b8baa;
        }
        .n8n-iframe-wrapper {
          flex: 1;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid #2a2a3a;
          background: #0f0f1e;
          display: flex;
          flex-direction: column;
          animation: floatIn 0.4s ease;
          min-height: 0;
        }
        .n8n-iframe-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #0a0a16;
          border-bottom: 1px solid #1e1e30;
          flex-shrink: 0;
        }
        .n8n-iframe {
          width: 100%;
          flex: 1;
          border: none;
          background: #101020;
          min-height: 0;
        }
        .n8n-unconfigured {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 32px;
          text-align: center;
          animation: floatIn 0.4s ease;
        }
      `}</style>

            <div
                style={{
                    minHeight: "100vh",
                    background: "#0c0c18",
                    fontFamily: "'Syne', sans-serif",
                    padding: "0",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        borderBottom: "1px solid #1a1a2e",
                        padding: "16px 32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                            }}
                        >
                            ⚙️
                        </div>
                        <span
                            style={{
                                color: "#e0e0ff",
                                fontWeight: 800,
                                fontSize: "16px",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            AutoFlow<span style={{ color: "#8b5cf6" }}>.</span>demo
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#10b981",
                                animation: "pulse 2s infinite",
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "11px",
                                color: "#10b981",
                            }}
                        >
                            n8n workflow live
                        </span>
                    </div>
                </div>

                {/* Main */}
                <div className="app-grid">
                    {/* LEFT — Form */}
                    <div
                        className="left-panel"
                        style={{
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    fontSize: "10px",
                                    color: "#8b5cf6",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    marginBottom: "8px",
                                }}
                            >
                                Trigger — Lead Form
                            </div>
                            <h1
                                style={{
                                    fontSize: "26px",
                                    fontWeight: 800,
                                    color: "#e0e0ff",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.2,
                                }}
                            >
                                Submit a lead.
                                <br />
                                <span style={{ color: "#8b5cf6" }}>Watch it flow.</span>
                            </h1>
                            <p
                                style={{
                                    marginTop: "8px",
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    fontSize: "12px",
                                    color: "#555577",
                                    lineHeight: 1.6,
                                }}
                            >
                                Fill the form → n8n processes it live → watch every automation node execute in real time on the right.
                            </p>
                        </div>

                        {!submitted ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {/* Webhook Toggle Switch */}
                                <div style={{
                                    background: "#0f0f1e",
                                    border: "1.5px solid #2a2a3a",
                                    borderRadius: "10px",
                                    padding: "12px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "4px",
                                    animation: "fadeUp 0.3s ease",
                                }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#e0e0ff", fontWeight: 600 }}>Real Webhook Trigger</span>
                                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#555577" }}>POST to configured webhook URL</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: webhookActive ? "#10b981" : "#555577", fontWeight: 600 }}>
                                            {webhookActive ? "ACTIVE" : "OFF"}
                                        </span>
                                        <button
                                            onClick={() => setWebhookActive(!webhookActive)}
                                            style={{
                                                width: "40px",
                                                height: "22px",
                                                borderRadius: "11px",
                                                background: webhookActive ? "#10b981" : "#2a2a3a",
                                                border: "none",
                                                cursor: "pointer",
                                                position: "relative",
                                                transition: "all 0.3s ease",
                                                padding: 0,
                                            }}
                                        >
                                            <div style={{
                                                width: "16px",
                                                height: "16px",
                                                borderRadius: "50%",
                                                background: "#fff",
                                                position: "absolute",
                                                top: "3px",
                                                left: webhookActive ? "21px" : "3px",
                                                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                                            }} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div>
                                        <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#555577", display: "block", marginBottom: "6px", letterSpacing: "0.1em" }}>CUSTOMER NAME *</label>
                                        <input
                                            placeholder="Sarah Jenkins"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#555577", display: "block", marginBottom: "6px", letterSpacing: "0.1em" }}>EMAIL ADDRESS *</label>
                                        <input
                                            placeholder="sarah@example.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#555577", display: "block", marginBottom: "6px", letterSpacing: "0.1em" }}>PROGRAM SELECTED</label>
                                    <input
                                        placeholder="e.g. 8-Week Strong Body"
                                        value={form.program}
                                        onChange={(e) => setForm({ ...form, program: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!form.name || !form.email || isSubmitting}
                                    style={{
                                        padding: "13px 24px",
                                        background: form.name && form.email && !isSubmitting ? "linear-gradient(135deg, #ec4899, #f97316)" : "#1a1a2e",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: form.name && form.email && !isSubmitting ? "#fff" : "#333355",
                                        fontFamily: "'Syne', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        cursor: form.name && form.email && !isSubmitting ? "pointer" : "not-allowed",
                                        letterSpacing: "0.02em",
                                        transition: "all 0.2s",
                                        marginTop: "4px",
                                    }}
                                >
                                    {isSubmitting ? (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                            <div style={{
                                                width: "16px",
                                                height: "16px",
                                                borderRadius: "50%",
                                                border: "2px solid #ffffff",
                                                borderTopColor: "transparent",
                                                animation: "spin 0.6s linear infinite",
                                            }} />
                                            <span>Triggering workflow...</span>
                                        </div>
                                    ) : (
                                        "Process Purchase → Start Onboarding 🛍️"
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div
                                style={{
                                    background: "#0f0f1e",
                                    border: "1.5px solid #2a2a3a",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    animation: "fadeUp 0.4s ease",
                                }}
                            >
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#555577", marginBottom: "12px", letterSpacing: "0.1em" }}>PAYLOAD SENT TO N8N</div>
                                <pre
                                    style={{
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        fontSize: "12px",
                                        color: "#8b5cf6",
                                        lineHeight: 1.7,
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {`{
  "name": "${form.name || "Sarah Jenkins"}",
  "email": "${form.email || "sarah@example.com"}",
  "program": "${form.program || "8-Week Strong Body"}",
  "timestamp": "${new Date().toISOString()}",
  "source": "shopify_webhook_v4"
}`}
                                </pre>
                                {done && (
                                    <button
                                        onClick={handleReset}
                                        style={{
                                            marginTop: "16px",
                                            padding: "10px 20px",
                                            background: "transparent",
                                            border: "1.5px solid #2a2a3a",
                                            borderRadius: "8px",
                                            color: "#555577",
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                            width: "100%",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseOver={e => { e.target.style.borderColor = "#8b5cf6"; e.target.style.color = "#8b5cf6"; }}
                                        onMouseOut={e => { e.target.style.borderColor = "#2a2a3a"; e.target.style.color = "#555577"; }}
                                    >
                                        ↺ Reset & Run Again
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Log */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#333355", letterSpacing: "0.1em", marginBottom: "8px" }}>EXECUTION LOG</div>
                            <div
                                ref={logRef}
                                style={{
                                    background: "#080812",
                                    border: "1px solid #1a1a2e",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    height: "160px",
                                    overflowY: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "4px",
                                }}
                            >
                                {log.length === 0 ? (
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#1e1e30" }}>
                                        Waiting for trigger...
                                    </div>
                                ) : (
                                    log.map((entry, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                animation: "fadeUp 0.3s ease",
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                fontSize: "11px",
                                            }}
                                        >
                                            <span style={{ color: "#333355", flexShrink: 0 }}>{entry.time}</span>
                                            <span style={{ color: entry.color }}>{entry.msg}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Fake n8n Canvas */}
                    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        {/* n8n Canvas fills the panel */}
                        <FakeN8NCanvas
                            nodeStates={nodeStates}
                            running={running}
                            done={done}
                            onNodeClick={(node) => setActivePopupNode(node)}
                        />
                        {/* Execution summary strip shown when complete */}
                        {done && (
                            <div style={{
                                padding: "12px 24px",
                                background: "#10b98108",
                                borderTop: "1.5px solid #10b98130",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexShrink: 0,
                                animation: "fadeUp 0.5s ease",
                            }}>
                                <div style={{ display: "flex", gap: "24px" }}>
                                    {[
                                        { label: "Nodes", value: "6/6" },
                                        { label: "Duration", value: "4.8s" },
                                        { label: "Status", value: "✓ Success" },
                                    ].map((s) => (
                                        <div key={s.label}>
                                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 800, color: "#10b981" }}>{s.value}</div>
                                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#555577", letterSpacing: "0.08em" }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleExportSummary}
                                    style={{
                                        padding: "8px 16px",
                                        background: "rgba(16, 185, 129, 0.08)",
                                        border: "1px solid rgba(16, 185, 129, 0.3)",
                                        borderRadius: "8px",
                                        color: "#10b981",
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseOver={e => { e.target.style.background = "rgba(16, 185, 129, 0.15)"; }}
                                    onMouseOut={e => { e.target.style.background = "rgba(16, 185, 129, 0.08)"; }}
                                >
                                    {copiedText ? "📋 Copied!" : "📤 Export"}
                                </button>
                            </div>
                        )}
                    </div>


                    {/* Detail Popup Modal */}
                    {activePopupNode && (
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 9999,
                                background: "rgba(6, 6, 12, 0.85)",
                                backdropFilter: "blur(8px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "24px",
                                animation: "fadeUp 0.3s ease",
                            }}
                            onClick={() => setActivePopupNode(null)}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: "500px",
                                    background: "#0f0f1e",
                                    border: `2px solid ${activePopupNode.color}`,
                                    borderRadius: "16px",
                                    padding: "24px",
                                    boxShadow: `0 8px 32px ${activePopupNode.color}25`,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                    fontFamily: "'IBM Plex Mono', monospace",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "8px",
                                            background: `${activePopupNode.color}25`,
                                            border: `1px solid ${activePopupNode.color}50`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "18px",
                                        }}>
                                            {activePopupNode.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "14px", fontWeight: 600, color: activePopupNode.color }}>
                                                {activePopupNode.label}
                                            </div>
                                            <div style={{ fontSize: "10px", color: "#555577", marginTop: "2px" }}>
                                                Execution Payload Outcomes
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActivePopupNode(null)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "#555577",
                                            fontSize: "20px",
                                            cursor: "pointer",
                                            padding: "4px",
                                        }}
                                        onMouseOver={e => e.target.style.color = "#fff"}
                                        onMouseOut={e => e.target.style.color = "#555577"}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Payload block */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div style={{ fontSize: "9px", color: "#555577", letterSpacing: "0.1em" }}>OUTPUT JSON</div>
                                    <div style={{
                                        background: "#080812",
                                        border: "1.5px solid #2a2a3a",
                                        borderRadius: "10px",
                                        padding: "16px",
                                        maxHeight: "240px",
                                        overflowY: "auto",
                                    }}>
                                        <pre style={{
                                            fontSize: "11px",
                                            color: "#e0e0ff",
                                            lineHeight: "1.6",
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                        }}>
                                            {JSON.stringify(
                                                Object.fromEntries(
                                                    Object.entries(activePopupNode.details).map(([key, val]) => [
                                                        key,
                                                        typeof val === "string"
                                                            ? val.replace("{{email}}", form.email || "john@company.com")
                                                                .replace("{{name}}", form.name || "John Smith")
                                                            : val
                                                    ])
                                                ),
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                                    <button
                                        onClick={() => {
                                            const replacedDetails = Object.fromEntries(
                                                Object.entries(activePopupNode.details).map(([key, val]) => [
                                                    key,
                                                    typeof val === "string"
                                                        ? val.replace("{{email}}", form.email || "john@company.com")
                                                            .replace("{{name}}", form.name || "John Smith")
                                                        : val
                                                ])
                                            );
                                            navigator.clipboard.writeText(JSON.stringify(replacedDetails, null, 2));
                                            const btn = document.getElementById("copy-node-payload-btn");
                                            if (btn) {
                                                btn.innerText = "📋 Payload Copied!";
                                                setTimeout(() => { btn.innerText = "📄 Copy Payload JSON"; }, 2000);
                                            }
                                        }}
                                        id="copy-node-payload-btn"
                                        style={{
                                            flex: 1,
                                            padding: "10px 16px",
                                            background: "rgba(139, 92, 246, 0.08)",
                                            border: "1px solid rgba(139, 92, 246, 0.3)",
                                            borderRadius: "8px",
                                            color: "#8b5cf6",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseOver={e => e.target.style.background = "rgba(139, 92, 246, 0.15)"}
                                        onMouseOut={e => e.target.style.background = "rgba(139, 92, 246, 0.08)"}
                                    >
                                        📄 Copy Payload JSON
                                    </button>
                                    <button
                                        onClick={() => setActivePopupNode(null)}
                                        style={{
                                            padding: "10px 16px",
                                            background: "#2a2a3a",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#e0e0ff",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                        onMouseOver={e => e.target.style.background = "#3a3a4e"}
                                        onMouseOut={e => e.target.style.background = "#2a2a3a"}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}