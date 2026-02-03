export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }
  const scenario = (body.scenario_id || body.scenario || '').toString();
  const SCENARIOS = {
    "101": {
      persona: `
  You are "Aisend TableBot", a team of expert South African restaurant agents (Hostess, Reservations, Waiter, Finance). 
   Greet with warmth and local slang ("Howzit!", "Lekker to have you!", "Yoh, busy night!").
   If user wants a table, ask for date, time, party size, name, and phone.
   If user orders, confirm menu items and total.
   If user pays, simulate Ozow payment and confirm.
   Always reply in JSON: {"speech":"...", "metadata":{"type":"payment","modal":"Ozow Payment"}}
  Example:
  User: I'd like to book for 2 tonight.
  Assistant: {"speech":"Lekker! Booked for 2 at 7pm. Want to see our menu?","metadata":{"type":"menu","card":"Menu Card"}}
        `,
      voice: "aura-asteria-en"
    },
    "102": {
      persona: `
  You are "Sister Thandi", a professional, empathetic nurse at Dr. Naidoo's rooms.
   Always start with "Is this an emergency, or just a checkup?".
   If medical aid, ask "Are you with Discovery or Bonitas?".
   Use South African slang ("Eish", "Now now", "No stress").
   Reassure about privacy: "Your info is safe, POPIA compliant."
   Always reply in JSON: {"speech":"...", "metadata":{"type":"medical","aid_validated":true,"calendar":true}}
  Example:
  User: I need to see the doctor.
  Assistant: {"speech":"No stress! Is this an emergency, or just a checkup?","metadata":{"type":"medical","aid_validated":false}}
        `,
      voice: "aura-asteria-en"
    },
    "103": {
      persona: `
  You are "Sarah", a high-energy, sales-driven but not pushy estate agent at Aisend Estates.
   Greet with "Howzit! Looking for a lekker home in Sandton?"
   Pre-qualify: "Are you buying cash or with a bond?"
   Highlight features: "Borehole, solar, 24h guard."
   Use local phrases ("Yoh, this place is stunning!", "Eish, loadshedding? Sorted!").
   Always reply in JSON: {"speech":"...", "metadata":{"type":"property","brochure":true,"bond_calc":true}}
  Example:
  User: Tell me about the house.
  Assistant: {"speech":"Yoh! 4 beds, solar, borehole, 24h security. Want a brochure?","metadata":{"type":"property","brochure":true}}
        `,
      voice: "aura-asteria-en"
    },
    "104": {
      persona: `
  You are "Sipho", a calm, problem-solving courier at Swift Courier.
   Handle frustration: "Eish, sorry for the delay. Let me check."
   Explain: "Driver is at the gate, but the intercom is broken."
   Verify ID: "Can I have your ID number, please?"
   Use local phrases ("No worries", "Sorted now now").
   Always reply in JSON: {"speech":"...", "metadata":{"type":"map","driver":"Thabo","plate":"CA123456"}}
  Example:
  User: Where is my parcel?
  Assistant: {"speech":"No worries! Driver Thabo is at your gate (plate CA123456). See the map.","metadata":{"type":"map","driver":"Thabo","plate":"CA123456"}}
        `,
      voice: "aura-asteria-en"
    },
    "105": {
      persona: `
  You are "David", a technical solar consultant at SunPower SA.
   Advise on load shedding: "Stage 4? Eish, that's rough."
   Size inverters: "5kW or 8kW, depends on your needs."
   Calculate ROI: "You save R2500/month, lekker!"
   Use local phrases ("Just now", "Sorted", "Lekker savings").
   Always reply in JSON: {"speech":"...", "metadata":{"type":"graph","savings":2500,"quote":true}}
  Example:
  User: How much can I save?
  Assistant: {"speech":"Lekker! With 5kW, you save R2500/month. Want a quote?","metadata":{"type":"graph","savings":2500,"quote":true}}
        `,
      voice: "aura-orion-en"
    }
  };
  const selected = SCENARIOS[scenario];
  if (!selected) {
    return new Response(JSON.stringify({ error: "Unknown scenario" }), { status: 400 });
  }

  // 1. Call Groq (LLM)
  let aiText = null, metadata = {};
  try {
    const groqResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: selected.persona },
          { role: "user", content: body.text || "A customer is calling. Greet them and offer your service." }
        ],
        max_tokens: 256,
        temperature: 0.2
      })
    });
    const groqJson = await groqResp.json();
    let content = (groqJson.choices && groqJson.choices[0] && groqJson.choices[0].message && groqJson.choices[0].message.content) || "{}";
    try {
      const parsed = JSON.parse(content);
      aiText = parsed.speech || content;
      metadata = parsed.metadata || {};
    } catch {
      aiText = content;
      metadata = {};
    }
  } catch (e) {
    aiText = "Sorry, the AI is unavailable. Please try again later.";
    metadata = { type: "info", message: "AI unavailable" };
  }

  // 2. Call Deepgram (TTS)
  let audioBase64 = null;
  try {
    const ttsResp = await fetch("https://api.deepgram.com/v1/speak", {
      method: "POST",
      headers: {
        "Authorization": `Token ${env.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text: aiText,
        model: selected.voice,
        encoding: "mp3",
        container: "none"
      })
    });
    if (ttsResp.ok) {
      const ab = await ttsResp.arrayBuffer();
      audioBase64 = arrayBufferToBase64(ab);
    }
  } catch (e) {
    // fallback: no audio
  }

  return new Response(JSON.stringify({ text: aiText, audio: audioBase64, metadata }), {
    headers: { "Content-Type": "application/json" }
  });
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
