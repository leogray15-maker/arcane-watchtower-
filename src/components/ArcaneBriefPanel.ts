import { Panel } from './Panel';
import { marked } from 'marked';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

const SYSTEM_PROMPT = `You are the Arcane Intelligence Analyst. You produce sharp, no-fluff daily intelligence briefings for serious traders, entrepreneurs, and market watchers. Tone: direct, analytical, no mainstream media spin. Format with sections: GEOPOLITICAL PULSE, MARKETS & MACRO, OPPORTUNITY SIGNALS, THREAT VECTORS.`;

function todayStr(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export class ArcaneBriefPanel extends Panel {
  private briefContent = '';
  private lastGenerated = '';
  private loading = false;

  constructor() {
    super({ id: 'arcane-brief', title: '⬡ ARCANE BRIEF', showCount: false });
    this.renderBrief();
  }

  private buildHtml(): string {
    const timestampHtml = this.lastGenerated
      ? `<div style="font-size:10px;color:#92400e;margin-bottom:8px;">Generated: ${this.lastGenerated}</div>`
      : '';

    const contentHtml = this.briefContent
      ? `<div class="arcane-brief-content" style="font-size:12px;line-height:1.6;color:var(--text);max-height:600px;overflow-y:auto;">${this.briefContent}</div>`
      : `<div style="font-size:12px;color:var(--text-dim);text-align:center;padding:24px 12px;">
          <div style="font-size:24px;margin-bottom:8px;">⬡</div>
          <div>Press the button below to generate today's Arcane Intelligence Brief.</div>
         </div>`;

    const buttonLabel = this.loading
      ? 'Generating...'
      : this.briefContent
        ? 'Regenerate'
        : "Generate Today's Brief";

    return `
      <div style="border:1px solid #3d2e0a;border-radius:4px;padding:12px;background:rgba(245,158,11,0.03);">
        ${timestampHtml}
        ${contentHtml}
        <button
          class="arcane-brief-btn"
          ${this.loading ? 'disabled' : ''}
          style="
            margin-top:12px;
            width:100%;
            padding:10px;
            background:${this.loading ? '#1a1408' : '#f59e0b'};
            color:${this.loading ? '#92400e' : '#000'};
            border:1px solid #d97706;
            border-radius:4px;
            cursor:${this.loading ? 'wait' : 'pointer'};
            font-weight:bold;
            font-size:12px;
            letter-spacing:1px;
            font-family:var(--font-mono);
            transition:background 0.2s;
          "
        >${buttonLabel}</button>
      </div>
    `;
  }

  private renderBrief(): void {
    this.setContent(this.buildHtml());
    // Attach click handler after content is set
    setTimeout(() => {
      const btn = this.content.querySelector('.arcane-brief-btn');
      btn?.addEventListener('click', () => this.generateBrief());
    }, 0);
  }

  private async generateBrief(): Promise<void> {
    if (this.loading) return;

    if (!ANTHROPIC_API_KEY) {
      this.briefContent = '<div style="color:#ff4444;">VITE_ANTHROPIC_API_KEY not configured. Set it in your environment variables.</div>';
      this.renderBrief();
      return;
    }

    this.loading = true;
    this.renderBrief();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: `Generate today's Arcane Intelligence Brief for ${todayStr()}. Focus on what actually matters for traders and entrepreneurs in the UK.`,
            },
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const text = data.content?.[0]?.text || 'No content returned.';
      this.briefContent = marked.parse(text) as string;
      this.lastGenerated = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' — ' + todayStr();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.briefContent = `<div style="color:#ff4444;">Failed to generate brief: ${msg}</div>`;
    } finally {
      this.loading = false;
      this.renderBrief();
    }
  }
}
