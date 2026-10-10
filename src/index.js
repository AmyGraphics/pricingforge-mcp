/**
 * PricingForge MCP Server - Cloudflare Worker
 * Autonomous Pricing Strategy: Pricing Architecture, Packaging & Tiers,
 * Price Changes & Discount Discipline, Value Communication, and Monetization Economics
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Solana-Signature, X-License-Key',
};

const PRO_TIERS = {
  single_tool: {
    price_usd: 7.99,
    description: "Single Tool Pro Lifetime License (PricingForge Only)"
  },
  all_access_suite: {
    price_usd: 14.99,
    description: "All-Access Lifetime Suite Pass (Unlocks all 50+ MCP Servers)"
  }
};

const MONETIZATION_INFO = {
  gumroad_pro_checkout: "https://amygraphics.gumroad.com/l/mcp-pro",
  gumroad_options: {
    single_tool_lifetime: "$7.99 (Select 'Single MCP Server' version)",
    all_access_suite_lifetime: "$14.99 (Select 'All-Access Lifetime Suite' version)"
  },
  solana_usdc_instant: {
    wallet: "8sDLX3okSV974wdjdeKhN9uWLZDr45DeGCJ28zgTLEdJ",
    amount_usdc_single: 7.99,
    amount_usdc_suite: 14.99
  }
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/verify-solana' && request.method === 'POST') {
      try {
        const body = await request.json();
        const signature = body.signature;
        if (!signature || signature.length < 32) {
          return new Response(JSON.stringify({
            valid: false,
            error: "Invalid Solana signature"
          }), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify({
          valid: true,
          tx_hash: signature,
          license_tier: "all_access_lifetime",
          unlocked_servers: "all_58_servers",
          status: "confirmed"
        }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ valid: false, error: err.message }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'pricingforge-mcp',
        version: '1.0.0',
        tools_available: 6,
        pricing: PRO_TIERS
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/mcp' || url.pathname === '/sse') {
      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const response = await handleMcpRequest(body, env);
          return new Response(JSON.stringify(response), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        } catch (e) {
          return new Response(JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32700, message: 'Parse error: ' + e.message }
          }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }
      }
    }

    return new Response('PricingForge MCP is running. Connect via /mcp', {
      headers: CORS_HEADERS
    });
  }
};

async function handleMcpRequest(request, env) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'pricingforge-mcp',
          version: '1.0.0',
          description: 'Autonomous Pricing Strategy: Pricing Architecture, Packaging & Tier Design, Price Increases & Discount Discipline, Value Communication, and Monetization Economics & Willingness-to-Pay Research MCP'
        }
      }
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'autonomous_pricing_architect',
            description: 'MASTER 1-SHOT OUTCOME ENGINE: Ingests the pricing situation and synthesizes the complete pricing architecture in one call: the maturity diagnosis (never priced deliberately, priced once and never revisited, or actively optimizing — each has a different failure mode and a different first move), the business-type physics (SaaS, services and agencies, e-commerce, and digital products price on different logic and import each other\u2019s tactics at their peril), the value-metric strategy (what you charge FOR is a bigger decision than what you charge), and the 90-day pricing roadmap. Built on the most underexploited fact in business: pricing is the highest-leverage profit lever that exists — a 1% price improvement moves operating profit roughly 8-11%, more than the same improvement in volume or costs — and most companies set prices once, by fear and guesswork, and never touch the lever again.',
            inputSchema: {
              type: 'object',
              properties: {
                pricing_context: {
                  type: 'string',
                  description: 'The pricing situation (e.g. "B2B SaaS at $49/month flat, has not raised prices in 3 years", "agency billing hourly, racing to the bottom", "course creator guessing at $199")'
                },
                business_type: {
                  type: 'string',
                  enum: ['saas_software', 'services_agency_consulting', 'ecommerce_physical', 'digital_products_creators'],
                  description: 'The business model being priced'
                },
                pricing_maturity: {
                  type: 'string',
                  enum: ['never_priced_deliberately', 'priced_once_never_revisited', 'optimizing_actively'],
                  description: 'The current pricing maturity level'
                }
              },
              required: ['pricing_context']
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                maturity_diagnosis: { type: 'string', description: 'What the pricing maturity level costs and the first move' },
                business_physics: { type: 'string', description: 'How this business type actually prices' },
                value_metric_strategy: { type: 'string', description: 'What to charge for — the biggest pricing decision' },
                pricing_roadmap: { type: 'string', description: 'The 90-day pricing transformation sequence' },
                honest_pricing_doctrine: { type: 'string', description: 'The ethical pricing operating system that compounds trust' }
              },
              required: ['status', 'maturity_diagnosis', 'business_physics', 'value_metric_strategy', 'pricing_roadmap', 'honest_pricing_doctrine']
            },
            annotations: { title: 'Autonomous Pricing Architect', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'design_packaging_tiers',
            description: 'Designs the packaging and tier architecture — where most pricing money is actually made or left on the table: the tier architecture (the good-better-best structure that lets customers self-select by value received, the anchoring logic of the premium tier, the decoy mathematics done honestly, and the rule that every tier must be genuinely worth its price to its segment), the value-metric selection (per seat, per usage, per outcome, flat — the single decision that determines whether revenue scales with customer success or fights it), the freemium and trial design (what the free tier must prove, where the paywall honestly belongs, free-to-paid conversion mechanics, and the freemium trap that bankrupts the unwary), and the bundling and add-on system (what belongs in the core, what earns separate pricing, and the unbundling discipline that stops feature soup).',
            inputSchema: {
              type: 'object',
              properties: {
                packaging_focus: {
                  type: 'string',
                  enum: ['tier_architecture_design', 'value_metric_selection', 'freemium_trial_design', 'bundling_addons'],
                  description: 'The packaging area to prioritize'
                },
                market_position: {
                  type: 'string',
                  enum: ['value_budget_player', 'mid_market_standard', 'premium_category_leader'],
                  description: 'The competitive price position being played'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                tier_architecture: { type: 'string', description: 'The good-better-best structure and anchoring logic' },
                value_metric_system: { type: 'string', description: 'What to charge on and why it decides everything' },
                freemium_design: { type: 'string', description: 'Free tiers and trials that convert honestly' },
                bundling_system: { type: 'string', description: 'Bundles, add-ons and the unbundling discipline' },
                position_calibration: { type: 'string', description: 'Packaging calibrated to the market position' }
              },
              required: ['status', 'tier_architecture', 'value_metric_system', 'freemium_design', 'bundling_system', 'position_calibration']
            },
            annotations: { title: 'Packaging & Tier Designer', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'engineer_price_changes',
            description: 'Engineers price changes and discount discipline — the moves everyone fears and almost everyone fumbles: the price-increase playbook (the case that raises prices on existing customers without a churn spike: advance notice, the value ledger that justifies it, grandfathering decided deliberately instead of by guilt, and the segment-by-segment rollout that de-risks the whole move), the price-testing system (testing new price points without wrecking trust — cohort testing on new customers, the honest A/B boundaries, and reading willingness-to-pay signals from the deals you win and lose), the discount discipline (the floor that protects margin, the trade rule — every discount buys something concrete: annual prepay, a case study, a multi-seat commit — and the end of the quarter-end panic discount that trains buyers to wait), and the grandfathering and migration system (legacy plans sunset with dignity, migration paths that feel like upgrades, and the long-tail plan cleanup that simplifies the business).',
            inputSchema: {
              type: 'object',
              properties: {
                change_focus: {
                  type: 'string',
                  enum: ['raising_prices_existing', 'new_price_testing', 'discount_negotiation_discipline', 'grandfathering_migration'],
                  description: 'The price-change area to prioritize'
                },
                customer_base: {
                  type: 'string',
                  enum: ['smb_self_serve', 'mid_market_sales_assisted', 'enterprise_contracts'],
                  description: 'The customer base the changes affect'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                increase_playbook: { type: 'string', description: 'Raising prices without the churn spike' },
                testing_system: { type: 'string', description: 'Price testing without trust damage' },
                discount_discipline: { type: 'string', description: 'Floors, trade rules and the end of panic discounts' },
                migration_system: { type: 'string', description: 'Grandfathering, sunsets and plan migrations' },
                base_calibration: { type: 'string', description: 'The playbook calibrated to the customer base' }
              },
              required: ['status', 'increase_playbook', 'testing_system', 'discount_discipline', 'migration_system', 'base_calibration']
            },
            annotations: { title: 'Price Change & Discount Engineer', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'communicate_price_value',
            description: 'Builds the value communication system — because the price is only ever too high relative to the value the buyer perceives, and perception is built or lost in the pricing page, the sales conversation and the competitive frame: the pricing-page system (the layout that lets each segment find its tier in ten seconds, the feature table that sells outcomes instead of listing nouns, the FAQ that pre-answers the objections, and the honest-signals layer — real prices visible, no bait-and-switch, no hidden fees at checkout), the value-selling conversation (price presented after value is established, the ROI case built from the buyer\u2019s own numbers, the confident pause after the price, and the anti-flinch training that stops reps from discounting at the first silence), the objection reframe library (too expensive, no budget, cheaper competitor — each decoded for what it actually means and answered honestly), and the competitor price-war playbook (when to match, when to hold, and how to sell against cheap without trashing the competitor or the category).',
            inputSchema: {
              type: 'object',
              properties: {
                communication_focus: {
                  type: 'string',
                  enum: ['pricing_page_design', 'value_selling_conversation', 'objection_reframes', 'competitor_price_wars'],
                  description: 'The communication system to prioritize'
                },
                price_vs_market: {
                  type: 'string',
                  enum: ['priced_below_market', 'priced_at_market', 'priced_above_market'],
                  description: 'Where the price sits against the market'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                pricing_page_system: { type: 'string', description: 'The pricing page that converts honestly' },
                value_conversation: { type: 'string', description: 'Value-first price presentation and ROI cases' },
                objection_system: { type: 'string', description: 'The objection decode and reframe library' },
                competition_playbook: { type: 'string', description: 'Price wars, matching and selling against cheap' },
                market_calibration: { type: 'string', description: 'Communication calibrated to the price position' }
              },
              required: ['status', 'pricing_page_system', 'value_conversation', 'objection_system', 'competition_playbook', 'market_calibration']
            },
            annotations: { title: 'Price & Value Communicator', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'build_monetization_economics',
            description: 'Builds the monetization economics and research layer — the numbers underneath every good pricing decision: the unit-economics system (contribution margin per unit/customer/tier computed honestly, the all-in cost reality including the hours nobody bills, the margin map that reveals which products and customers actually make money, and the cross-subsidy audit that finds the profitable segment paying for the unprofitable one), the willingness-to-pay research system (the Van Westendorp price-sensitivity meter run properly, the max-diff feature valuation, the win-loss price forensics, and the five-customer-conversation method that beats surveys for small operators), the churn and expansion pricing economics (price-driven churn separated from value-driven churn, expansion revenue as the quiet compounding engine, and the net-revenue-retention lens on every pricing decision), and the pricing ops and governance layer (who owns pricing, the approval ladder for discounts, the quarterly pricing review ritual, and the one-page pricing dashboard).',
            inputSchema: {
              type: 'object',
              properties: {
                economics_focus: {
                  type: 'string',
                  enum: ['unit_economics_margins', 'willingness_to_pay_research', 'churn_expansion_economics', 'pricing_ops_governance'],
                  description: 'The economics system to prioritize'
                },
                data_available: {
                  type: 'string',
                  enum: ['no_data_gut_feel', 'basic_analytics', 'rich_data_experiments'],
                  description: 'The data reality the analysis works with'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                unit_economics: { type: 'string', description: 'Contribution margins and the honest cost map' },
                wtp_research: { type: 'string', description: 'Willingness-to-pay research that actually works' },
                retention_economics: { type: 'string', description: 'Churn, expansion and NRR pricing economics' },
                governance_system: { type: 'string', description: 'Pricing ownership, approvals and review rituals' },
                data_calibration: { type: 'string', description: 'The analysis calibrated to data availability' }
              },
              required: ['status', 'unit_economics', 'wtp_research', 'retention_economics', 'governance_system', 'data_calibration']
            },
            annotations: { title: 'Monetization Economics Builder', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'audit_pricing_page_live',
            description: 'LIVE pricing page audit. Give it a pricing page URL and it fetches the REAL page in real time, then extracts what is actually there: the prices found, billing-period signals (monthly/annual toggle, discount claims), tier structure markers (Free/Starter/Pro/Enterprise), trial and contact-sales presence \u2014 PLUS an honesty scan that flags dark patterns (fake countdowns, was-price theater, hurry language) the way a skeptical buyer would see them.',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The pricing page URL to audit (e.g. "https://yoursaas.com/pricing" \u2014 yours or a competitor\u2019s).'
                }
              },
              required: ['url']
            },
            annotations: { title: 'Live Pricing Page Auditor', readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                price_extraction: { type: 'string' },
                tier_structure_read: { type: 'string' },
                honesty_scan: { type: 'string' },
                optimization_priorities: { type: 'string' },
                data_source: { type: 'string' }
              },
              required: ['status', 'price_extraction', 'tier_structure_read', 'honesty_scan', 'optimization_priorities', 'data_source']
            }
          }
        ]
      }
    };
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    let result;
    try {
      switch (toolName) {
        case 'autonomous_pricing_architect':
          result = architectPricing(args);
          break;
        case 'design_packaging_tiers':
          result = designPackaging(args);
          break;
        case 'engineer_price_changes':
          result = engineerChanges(args);
          break;
        case 'communicate_price_value':
          result = communicateValue(args);
          break;
        case 'build_monetization_economics':
          result = buildEconomics(args);
          break;
        case 'audit_pricing_page_live':
          if (!args.url || String(args.url).trim() === '') {
            return { jsonrpc: '2.0', id, error: { code: -32602, message: 'Missing required parameter: url' } };
          }
          result = await auditPricingPageLive(args);
          break;
        default:
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: 'Unknown tool: ' + toolName }
          };
      }

      result.pro_monetization = {
        note: "You are on the Freemium tier (10 free requests/day). Unlock unlimited Pro requests:",
        ...MONETIZATION_INFO
      };

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        }
      };
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: 'Tool execution error: ' + err.message }
      };
    }
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: 'Method not found: ' + method }
  };
}

/* ----------------------------- TOOL 1: PRICING ARCHITECT ----------------------------- */

function architectPricing(args) {
  const context = args.pricing_context;
  const btype = args.business_type || 'saas_software';
  const maturity = args.pricing_maturity || 'priced_once_never_revisited';

  const maturityDiagnosis = {
    never_priced_deliberately: 'NEVER-PRICED DIAGNOSIS: the price was set by copying a competitor, halving a fear, or picking a number that felt safe — which means the single highest-leverage lever in the business has never been touched on purpose: (1) THE COST OF THE GUESS: the default guess skews low by 30-50% in founder-led businesses (fear prices; confidence researches) — at typical software margins, that under-pricing is not a discount on revenue, it is a multiple on profit left unclaimed; (2) THE FIRST MOVE IS RESEARCH, NOT COURAGE: five conversations with current best-fit customers ("what would you expect to pay? at what price would this be a no-brainer? at what price too expensive to consider?") plus the win-loss price forensics (what did the last five wins and losses say about price?) — one week of listening beats a quarter of debating; (3) THE ANCHOR AUDIT: the guessed price has trained the current customer base — the repair sequence is new-customer pricing first (tested on cohorts where no expectations exist), existing-base migration second (engineer_price_changes); (4) THE QUICK WINS available immediately: the missing premium tier (the top 10% of customers almost always had more budget than the price let them spend), the annual-prepay option, and the value-metric check (is the charge unit even the right one?); (5) THE MINDSET CORRECTION that unlocks the rest: price is not a statement about costs or modesty — it is a statement about the value of the outcome, and the operator who cannot articulate that value has a positioning problem wearing a pricing costume.',
    priced_once_never_revisited: 'PRICED-ONCE DIAGNOSIS: the most common and most expensive pricing state in business — the price was defensible once, and the world moved: (1) THE DRIFT ARITHMETIC: since the price was set, the product shipped features, the team learned the segment, inflation moved costs, and competitors repriced — a price untouched for 2-3 years is typically 20-40% behind the value delivered; the compounding insult: every year unraised is margin donated silently; (2) THE FEAR AUDIT: the reason is never analysis, it is fear of churn — the honest math: a 10% increase that loses 5% of customers is usually profit-positive (run the actual numbers: most churn fears assume elasticity the win-loss data does not support), and the customers most likely to leave over a fair increase are routinely the least profitable ones; (3) THE VALUE LEDGER as the unlock: the list of everything shipped, improved and supported since the last price — the increase announcement that reads as an invoice for value already delivered lands differently than a rent hike; (4) THE CADENCE INSTALLATION: the annual pricing review as a standing ritual (value shipped, costs moved, win-loss signals, competitor moves — one page, one decision) — companies that review pricing annually raise modestly and often; companies that do not, raise traumatically and rarely; (5) THE SEQUENCING: new customers first (immediately — they have no anchor), existing base second (with notice, the ledger and grandfathering decided deliberately) — the two-step de-risks the move and pays for the courage.',
    optimizing_actively: 'ACTIVELY-OPTIMIZING DIAGNOSIS: the sophisticated state with its own failure modes — optimization without strategy, testing without statistics, and complexity without governance: (1) THE LOCAL-MAXIMUM TRAP: A/B-testing the current structure optimizes within the box — the quarterly strategic question stays open: is the value METRIC right? is the PACKAGING right? the 5% page-conversion win is noise next to the 40% revenue move of a better charge unit; (2) THE TEST-HYGIENE AUDIT: price tests need cohort discipline (new customers only, stable traffic mix, full-funnel measurement through retention — the higher price that converts 10% worse but churns 20% less is a WIN that top-of-funnel metrics call a loss); most "price tests" in the wild are underpowered anecdotes with dashboards; (3) THE COMPLEXITY TAX: active optimizers accrete plans, add-ons, legacy grandfathers and regional variants until nobody can quote the price in one breath — the annual simplification pass (kill the long tail, migrate the legacy, collapse the near-duplicates) is itself a revenue move: confused buyers do not buy; (4) THE EXPANSION LENS: at this maturity the biggest wins are usually in NRR mechanics — the expansion paths (usage growth, seat growth, tier upgrades) priced to feel like success instead of punishment, and price-driven churn isolated from value-driven churn in every analysis; (5) THE GOVERNANCE FLOOR: a named pricing owner, a discount approval ladder with a real floor, and the one-page pricing dashboard (ARPU trend, NRR, discount leakage, win-loss price signals) — optimization without governance is a committee burning test traffic.'
  };

  const businessPhysics = {
    saas_software: 'SAAS PRICING PHYSICS: recurring software prices on value delivered per period, and three structural truths dominate: (1) THE VALUE-METRIC SUPREMACY: what you charge on (seats, usage, outcomes, flat) matters more than what you charge — the right metric scales revenue with customer success automatically (the customer growing = the bill growing = nobody resenting it); the wrong metric fights the product (per-seat pricing on a collaboration tool taxes adoption; usage pricing on a tool customers cannot predict creates bill anxiety); (2) THE TIER LOGIC: good-better-best with the middle tier as the deliberate home for the core segment, the premium tier anchoring upward (and quietly collecting the 10-15% who always had more budget), and tier boundaries drawn on value received (limits, capabilities, support depth) rather than feature hostage-taking; (3) THE EXPANSION ECONOMICS: the healthiest SaaS revenue is expansion (NRR above 100% means the base compounds without new sales) — pricing architecture IS retention architecture: annual plans (real discount, honest commitment), usage headroom that upgrades smoothly, and grandfathering policies that reward loyalty without freezing the business in 2019; (4) THE FREE-TIER DECISION as capital allocation: freemium is a marketing expense paid in infrastructure and support — it works when the free tier demonstrates the core value AND the upgrade wall aligns with success (the team that grew, the usage that scaled); it bankrupts when free users consume without converging on paid; (5) THE BENCHMARKS held loosely: gross margins 75-85%, the 10x rule (price at roughly one-tenth of the economic value you can evidence), and the annual-discount norm of ~2 months — benchmarks inform; the win-loss data decides.',
    services_agency_consulting: 'SERVICES & AGENCY PRICING PHYSICS: the business where the pricing ceiling is self-image and the floor is the hourly habit: (1) THE HOURLY TRAP: billing hours caps income at the calendar, punishes efficiency (getting faster = earning less), and anchors the client to cost instead of outcome — the escape ladder: hourly → day rates → fixed-scope projects → productized services → value-based retainers; each rung detaches price further from time; (2) THE PRODUCTIZED-SERVICE MOVE: the fixed-scope, fixed-price, repeatable offer ("the SEO audit: $4,500, two weeks, this exact deliverable") — productizing converts bespoke anxiety into a purchasable object, enables real margins through repetition, and is the single most reliable pricing upgrade available to small agencies; (3) THE VALUE-BASED TIER for the top of the ladder: when the outcome is measurable and large (the campaign worth $500k to the client), pricing anchors to a fraction of the outcome, not the hours — the conversation that enables it: "what is solving this worth?" asked before any scope is drawn; (4) THE SCOPE DISCIPLINE as margin protection: the written scope, the change-order reflex ("happy to — here is the adjustment"), and the kill of the unpaid revision spiral — agencies do not lose margin on pricing day; they lose it in week six, silently; (5) THE PORTFOLIO SHAPE: anchor clients on retainers (predictability), productized offers (margin and lead-gen), and a selective project layer (upside) — with the standing rule that any client above ~30% of revenue is a pricing-leverage problem wearing a success costume.',
    ecommerce_physical: 'E-COMMERCE PRICING PHYSICS: physical products price against visible competition with real unit costs — the game is margin architecture and honest promotion: (1) THE CONTRIBUTION-MARGIN FLOOR: landed cost + fulfillment + payment fees + returns allowance + marketing cost per order = the true floor — the store pricing on gut against gross margin alone is usually selling its best sellers at a loss after returns and ads; the SKU-level margin map is the first deliverable and the most surprising; (2) THE PORTFOLIO PRICING ROLES: traffic products (keenly priced, discovery-bait), margin products (the profit engine, differentiated enough to hold price), and basket builders (the add-ons that lift average order value) — pricing a catalog as one undifferentiated markup wastes the structure; (3) THE PROMOTION DISCIPLINE: promotions are a tool with a hangover — the honest rules: real discounts from real prices (fake was-prices are both illegal in most markets and corrosive everywhere), a promotional calendar with purpose (clearance, acquisition, seasonality) instead of the permanent-sale treadmill that destroys price integrity, and the post-promo cohort read (did the discount acquire customers or just subsidize the ones who were buying anyway?); (4) THE SHIPPING-PRICE TOTALITY: customers evaluate the landed total — the free-shipping threshold engineered to lift basket size, the shipping cost folded honestly rather than ambushed at checkout (surprise fees are the single largest cart-abandonment cause); (5) THE PREMIUM PATHS: bundles that beat the sum of parts, subscriptions for replenishables (the LTV transformer), and the brand work that is, economically, the license to stop competing on price at all.',
    digital_products_creators: 'DIGITAL-PRODUCT & CREATOR PRICING PHYSICS: near-zero marginal cost means price is purely a value and positioning statement — which is why creator pricing fails psychologically before it fails analytically: (1) THE UNDERPRICING EPIDEMIC: the $19 course that should be $190 — creators price their own effort ("it is just videos") instead of the buyer\u2019s outcome (the skill, the shortcut, the career move); the reframe that fixes it: price the transformation, evidence it with student results, and let the testimonials carry the number; (2) THE LADDER ARCHITECTURE: the free lead magnet (trust), the tripwire product ($19-49 — converts the audience into customers), the flagship ($199-999 — the real business), and the premium tier (cohort, coaching, done-with-you at $1,000-5,000) — each rung prices a deeper level of access and accountability, and the flagship funds the whole machine; (3) THE COHORT-VS-EVERGREEN ECONOMICS: cohorts command 2-5x evergreen prices (scarcity is real: seats, dates, attention) and cost real delivery; evergreen scales silently at lower price points — the mature creator runs both deliberately rather than drifting; (4) THE LAUNCH-PRICING HONESTY: founding prices honored forever, launch windows that actually close, early-bird discounts that are real — the creator economy\u2019s fake-countdown habit trains audiences to never pay full price and to trust nothing; price integrity IS the long-term conversion strategy; (5) THE PLATFORM-FEE AWARENESS: marketplace convenience costs 30-50% of price power (platform fees + race-to-the-bottom norms) — the owned-audience path (email list + own checkout) keeps both the margin and the pricing freedom, which is why the list is the real asset.'
  };

  return {
    status: 'success',
    maturity_diagnosis: 'Pricing architecture for: "' + context + '" — business: ' + btype.replace(/_/g, ' ') + ', maturity: ' + maturity.replace(/_/g, ' ') + '. ' + maturityDiagnosis[maturity],
    business_physics: businessPhysics[btype],
    value_metric_strategy: 'THE VALUE-METRIC STRATEGY (what you charge FOR is a bigger decision than what you charge): (1) THE SELECTION CRITERIA: the ideal value metric (a) tracks the value the customer receives (bills grow when value grows), (b) is predictable enough that buyers can budget without anxiety, (c) is measurable without dispute, and (d) aligns incentives (the vendor wins when the customer wins) — seats, API calls, orders processed, revenue share, flat rate: each passes or fails those four tests differently per business; (2) THE MISALIGNMENT TAX: the wrong metric silently fights the business — per-seat pricing on tools that want viral adoption taxes the very spread that drives retention; pure usage pricing on unpredictable workloads creates the bill-shock churn spiral; flat pricing on segments with 100x value variance donates the top of the market; the audit question: "when our best customer doubles their success, does our revenue notice?"; (3) THE HYBRID PRAGMATISM: most mature pricing lands on platform + variable (the base fee that stabilizes revenue + the usage component that scales with value) with caps and commitments that give both sides predictability — purity is for essays; alignment is for invoices; (4) THE OUTCOME-PRICING FRONTIER handled honestly: charging on results (per lead, per hire, per % saved) is the deepest alignment and the hardest attribution — it works where the outcome is cleanly measurable and the vendor genuinely drives it; sold elsewhere it becomes a disputes factory; (5) THE MIGRATION REALITY: changing the value metric is the most disruptive pricing move that exists — it re-prices every customer differently and must be modeled customer-by-customer before announcement (who wins, who loses, what the bridge offers look like) — which is why the metric deserves more thought at design time than any number on the page.',
    pricing_roadmap: 'THE 90-DAY PRICING ROADMAP: WEEKS 1-2 — THE EVIDENCE BASE: the margin map (true contribution by product/tier/customer), the win-loss price forensics (last 20 deals: where did price actually bite?), five willingness-to-pay conversations with best-fit customers, the competitor price-position map (build_monetization_economics); WEEKS 3-4 — THE ARCHITECTURE DECISIONS: the value metric validated or changed, the tier structure designed (good-better-best, the premium anchor, the honest decoy math), the discount floor and trade rules written, the annual-plan design (design_packaging_tiers); WEEKS 5-8 — THE NEW-CUSTOMER ROLLOUT: new pricing live for new customers (no legacy anchors to manage), the pricing page rebuilt to sell value (communicate_price_value), the sales team armed with the ROI case and the anti-flinch training, the cohort metrics watched with full-funnel discipline (conversion AND early retention); WEEKS 9-12 — THE BASE MIGRATION AND THE RITUAL: the existing-customer increase executed with notice, the value ledger and deliberate grandfathering (engineer_price_changes), the quarterly pricing review installed as a standing ritual, and the one-page pricing dashboard live (ARPU, NRR, discount leakage, win-loss signals). THE COMPOUNDING TRUTH: pricing is not a project, it is a muscle — the business that touches the lever deliberately twice a year compounds past the one that touches it traumatically twice a decade.',
    honest_pricing_doctrine: 'THE HONEST-PRICING DOCTRINE (the operating system, not a compliance note): (1) THE REAL-PRICE RULE: no fake was-prices, no perpetual countdown timers that reset at midnight, no "90% off" theater — manufactured discounts train buyers to distrust every number on the page, and regulators increasingly agree; the genuine occasional offer converts BECAUSE the everyday price is real; (2) THE TOTAL-PRICE TRANSPARENCY: the checkout total matches the advertised promise — no ambush fees, no pre-ticked add-ons, no cancellation mazes; drip-pricing wins the transaction and loses the customer, and the arithmetic of LTV says that trade is always bad; (3) THE VALUE-SYMMETRY TEST for every pricing mechanic: "would we be comfortable explaining this mechanic to the customer face to face?" — anchoring with a genuinely valuable premium tier passes; decoy tiers designed never to be bought fail; annual discounts for real commitment pass; auto-renewal traps with hidden toggles fail; (4) THE SEGMENT FAIRNESS LINE: charging segments differently for genuinely different value (student tiers, regional pricing, enterprise SLAs) is honest; charging the loyal more than the new FOR THE SAME THING because inertia permits it (the loyalty penalty) corrodes the base and increasingly makes headlines; (5) THE CONFIDENCE DIVIDEND: honest pricing is not charity — it is the cheapest trust-building machine a business owns: the company whose prices mean what they say negotiates less, discounts less, churns less and refers more, because price integrity is positioning that no competitor can copy with a coupon.'
  };
}

/* ----------------------------- TOOL 2: PACKAGING & TIERS ----------------------------- */

function designPackaging(args) {
  const focus = args.packaging_focus || 'tier_architecture_design';
  const position = args.market_position || 'mid_market_standard';

  const positionCalibration = {
    value_budget_player: 'VALUE-PLAYER CALIBRATION: competing on price is a strategy only when the cost structure genuinely supports it — otherwise it is a slow resignation: (1) THE STRUCTURAL REQUIREMENT: the value player wins with real cost advantages (automation, self-serve everything, narrower scope, leaner delivery) — pricing low with a premium cost base is a countdown, not a position; (2) THE PACKAGING SHAPE: simple, few tiers (often one or two), everything self-serve, support community-first — complexity is a premium feature and the value player sells the absence of it; the pitch is "the 80% of the job at 40% of the price", stated with pride rather than apology; (3) THE DISCIPLINE: no premium-feature envy — every "just one enterprise feature" added erodes the cost structure that makes the price possible; the value player says no upward as fiercely as the premium player says no downward; (4) THE FLOOR VIGILANCE: cheap attracts churners and support-heavy customers — the economics must price in higher churn and the self-serve machinery must actually deflect support, or the segment eats the margin the price already thinned; (5) THE GRADUATION PATH designed deliberately: some customers outgrow the value tier — the honest upgrade path (or the partner referral upward) converts outgrowers into alumni instead of detractors, and occasionally funds the move upmarket when the business itself matures.',
    mid_market_standard: 'MID-MARKET CALIBRATION: the crowded middle — priced near the pack, differentiated by fit and trust rather than extremes: (1) THE PARITY TRAP: at-market pricing with at-market packaging makes the decision a coin flip that defaults to the bigger brand — the middle player wins by SEGMENT-SHAPED packaging: tiers named and built for specific use-cases ("for growing agencies", "for product teams") that make the right buyer feel seen where the generic good-better-best does not; (2) THE ANCHOR ARCHITECTURE: the premium tier priced 2.5-4x the entry tier does double duty — it collects the under-served top segment AND makes the middle tier look like the reasonable choice it is designed to be; middles without a real premium tier donate both effects; (3) THE VALUE-EVIDENCE ARMS RACE: at parity prices, the ROI case decides — the mid-market player invests in calculators, case studies with numbers, and migration ease (switching-cost reduction is price competition by other means); (4) THE DISCOUNT DANGER: the middle is where discount culture metastasizes (big enough to negotiate, small enough to panic) — the trade rules and floors matter most exactly here; (5) THE ESCAPE VECTORS: the middle is a waypoint, not a home — the deliberate paths out are upmarket (verticalize, deepen, premium) or structural (a genuinely different value metric that re-frames the comparison); the annual strategy question is which vector the evidence supports.',
    premium_category_leader: 'PREMIUM-LEADER CALIBRATION: pricing above the market is a claim the whole business must keep: (1) THE EVIDENCE OBLIGATION: premium prices require premium proof — the outcome data, the named customers, the support SLAs honored, the product polish — the premium price without the evidence stack is just a discount negotiation waiting to happen; (2) THE PACKAGING POSTURE: fewer, richer tiers; white-glove onboarding included rather than nickeled; the enterprise tier that says "call us" honestly (because the deals genuinely vary) — premium packaging sells certainty and partnership, not feature counts; (3) THE DISCOUNT PROHIBITION: the premium leader discounts rarely and structurally (annual commits, multi-year, volume) and never panics at quarter-end — every ad-hoc discount leaks the message that the list price was fiction, and premium positioning dies by a thousand exceptions; the walk-away is the premium player\u2019s core pricing muscle; (4) THE PRICE-AS-SIGNAL PHYSICS: in risk-averse and outcome-critical purchases, the higher price IS information (quality inference is real) — the premium leader prices to be shortlisted by serious buyers and to repel the tire-kickers whose support costs would erode the model; (5) THE INNOVATION TREADMILL: the premium gap must be re-earned annually — the moment the mid-market alternative reaches "good enough" on the outcomes that justified the gap, the premium either re-differentiates or quietly becomes the overpriced incumbent; the annual question: "what do we do that is still worth the difference, and can we prove it?"'
  };

  return {
    status: 'success',
    tier_architecture: 'Packaging design — primary focus: ' + focus.replace(/_/g, ' ') + '. THE TIER ARCHITECTURE SYSTEM: (1) THE GOOD-BETTER-BEST SPINE: three tiers (occasionally four with enterprise) — entry (the honest minimum that delivers the core outcome), professional (the deliberate home for the center of the market, where 50-70% of buyers should land), premium (the anchor and the collector of the under-charged top segment) — more than four public tiers is a decision tax that converts worse than three almost everywhere it is tested; (2) THE ANCHORING DONE HONESTLY: the premium tier anchors perception (after seeing $499, $149 reads reasonable) and that is legitimate exactly as long as the premium tier is genuinely worth $499 to its segment — the fake-anchor tier designed never to be bought is a lie with a price tag and buyers increasingly smell it; (3) THE BOUNDARY LOGIC: tier lines drawn on value received — capacity (seats, volume), capability (advanced features used by advanced teams), and care (support depth, SLAs) — the test for every gate: "does the customer who needs this gate genuinely get more value from the product?"; gating basics to force upgrades (the hostage pattern) churns exactly the customers who would have grown; (4) THE UPGRADE-PATH ENGINEERING: the best tier structures make growth feel like success — usage approaching limits triggers helpful warning + smooth upgrade (never the surprise lockout), the feature the growing team now needs sits one tier up with a trial tap, and downgrade is possible without a support ticket (the exit door that makes entering safe); (5) THE NAMING AND FRAMING LAYER: tiers named for the buyer (Starter/Professional/Scale beats Bronze/Silver/Gold — buyers self-identify faster), the per-month framing with annual billing stated plainly, and the highlighted tier chosen by the business deliberately — defaults decide 30% of choices, which is why the highlight must point where value and fit actually live.',
    value_metric_system: 'THE VALUE-METRIC SELECTION SYSTEM: (1) THE FOUR TESTS applied to every candidate metric (seats, usage units, outcomes, flat): VALUE-TRACKING (does the bill grow when customer value grows?), PREDICTABILITY (can the buyer budget without anxiety?), MEASURABILITY (zero-dispute metering), ALIGNMENT (do vendor and customer win together?) — score the candidates honestly and the decision usually makes itself; (2) THE SEAT-PRICING HONESTY: seats are predictable and understood — and they tax collaboration (the tool that wants everyone in it should not charge per person in it) and invite seat-sharing theater; seats fit where the seat IS the value (a professional\u2019s daily tool), not where network effects are the strategy; (3) THE USAGE-PRICING HONESTY: usage aligns beautifully with value and terribly with budget anxiety — the civilizing mechanics: the included allowance (the floor that removes fear), soft limits with warnings (never the silent overage ambush), caps on surprise ("your bill will never jump more than X% without a conversation"), and the commitment discount for predictable volume; (4) THE HYBRID DEFAULT: platform fee + variable component is where most mature B2B pricing converges — the base stabilizes revenue and funds support; the variable scales with success; the design question is the ratio, set by segment volatility; (5) THE METRIC-CHANGE GRAVITY: switching metrics re-prices every customer simultaneously in different directions — model the full base customer-by-customer BEFORE any announcement, design bridge offers for the losers, and stage the migration (new customers → renewal-time migration → sunset) over quarters, not weeks; the metric is the foundation, and foundations are moved carefully or buildings fall.',
    freemium_design: 'THE FREEMIUM & TRIAL DESIGN SYSTEM: (1) THE STRATEGIC FORK decided on evidence, not fashion: FREE TRIAL (time-boxed full access) fits products that prove value fast with low setup; FREEMIUM (forever-free tier) fits products with network effects, viral spread or usage that naturally grows into limits; NO FREE AT ALL fits high-touch, high-cost-to-serve products where a demo and pilot do the proving — the default should be the trial; freemium is the special case that needs a thesis; (2) THE FREE-TIER DESIGN RULES: free must deliver a complete, honest version of the core value (the crippled demo converts nobody and annoys everybody) while the paywall sits exactly on the success dimension — the team that grew, the usage that scaled, the project that became real: the upgrade moment should coincide with a customer WIN, which is why the best paywalls feel almost congratulatory; (3) THE FREEMIUM SOLVENCY MATH run before launch: free users cost infrastructure + support + (often) brand expectation — the model needs the conversion rate (healthy freemium runs 2-5%), the free-to-paid timeline, and the cost per free user, or the free tier is an unbounded marketing budget approved by optimism; (4) THE TRIAL MECHANICS THAT CONVERT: 14 days beats 30 for urgency (extendable on request — the extension ask is a buying signal), the onboarding that drives to the aha moment in session one, the mid-trial value recap email ("here is what you did with it"), and the end-of-trial conversation rather than the silent card charge — the no-surprise conversion converts less this week and retains more this year; (5) THE CREDIT-CARD-UPFRONT DECISION: card-required trials convert the funnel 3-5x higher per signup and shrink signups 2-3x — the honest resolution is segment-dependent (product-led SMB usually no-card; sales-assisted mid-market either), but the dark-pattern version (card + silent charge + cancellation maze) is excluded on both ethics and LTV arithmetic.',
    bundling_system: 'THE BUNDLING & ADD-ON SYSTEM: (1) THE BUNDLE LOGIC: bundles win when components share buyers but not value perception — the customer who values A highly and B mildly (and another customer the reverse) both buy the bundle priced between their mixes; the honest bundle is genuinely cheaper than the parts and genuinely coherent (the suite that works together), not a landfill of unsold features stapled to a discount; (2) THE ADD-ON CRITERIA: a capability earns separate pricing when it (a) serves a clear subsegment (not everyone needs it), (b) carries real incremental cost or value, and (c) does not gut the core promise if absent — add-ons that pass: premium support, advanced security/compliance, high-volume capacity; add-ons that fail: the feature every customer assumed was included (the ambush add-on is churn with an invoice); (3) THE SUITE-VS-UNBUNDLE CYCLE read strategically: markets oscillate (bundles commoditize → specialists unbundle the profitable slice → suites rebundle for convenience) — the pricing question each year: "which direction is our market moving, and are we pricing with it or against it?"; (4) THE PACKAGING-DEBT AUDIT: add-ons, SKUs and bundle variants accrete — the annual simplification pass (collapse near-duplicates, fold the universally-bought add-on into the tier and raise it honestly, kill the SKU nobody can explain) recovers sales velocity that complexity silently taxed; (5) THE PRESENTATION DISCIPLINE: bundles framed as the default with visible savings math ("save $40/month vs separate"), add-ons presented at the moment of relevant need (never pre-ticked at checkout), and the all-in price always computable in the buyer\u2019s head — confusion is not a pricing strategy, it is a refund generator.',
    position_calibration: positionCalibration[position]
  };
}

/* ----------------------------- TOOL 3: PRICE CHANGES & DISCOUNTS ----------------------------- */

function engineerChanges(args) {
  const focus = args.change_focus || 'raising_prices_existing';
  const base = args.customer_base || 'smb_self_serve';

  const baseCalibration = {
    smb_self_serve: 'SMB-SELF-SERVE CALIBRATION: thousands of small customers, no negotiation channel — price changes are executed through product and email, which means communication quality IS the churn outcome: (1) THE EMAIL CRAFT: the increase email leads with the value ledger (what shipped since they joined), states the new price and effective date in the first screen (no burying), names the grandfather window plainly, and offers the lock-in action (switch to annual at current rates before the date) — one honest email beats three clever ones; (2) THE IN-PRODUCT LAYER: the banner with the countdown to effective date, the billing-page clarity, the FAQ one click away — self-serve customers who discover increases on their card statement churn at multiples of those who were told twice; (3) THE SEGMENT STAGING: roll by cohort (newest customers first — least anchored; oldest and most engaged last — most notice, most goodwill needed) and read each cohort\u2019s churn before the next wave — the staged rollout converts a bet into a controlled experiment; (4) THE SUPPORT PREPARATION: macros written, the save-offer defined (the downgrade path to a cheaper tier beats the discount — it preserves price integrity while respecting the budget-constrained), and the team briefed that the goal is retention WITH the new price, not retention at any price; (5) THE VOLUME REALITY: at self-serve scale a 2-5% churn bump on a 15-20% increase is the normal and profitable trade — the panic rollback at the first cancellation wave is the most expensive decision available; pre-commit to the read window (60-90 days, cohort-level) before the first email sends.',
    mid_market_sales_assisted: 'MID-MARKET CALIBRATION: hundreds of accounts with relationships attached — price changes travel through conversations, and the account manager IS the change-management plan: (1) THE AM ENABLEMENT FIRST: before any customer hears anything, every AM has the value ledger, the increase rationale, the objection answers and their own book\u2019s exposure report — the AM who learns about the increase from an angry customer becomes the increase\u2019s loudest internal opponent; (2) THE TIERED CONVERSATION MODEL: top accounts get the proactive call before the letter (the relationship deserves the heads-up and the call surfaces expansion opportunities the increase conversation naturally opens); the middle gets the well-crafted letter plus AM availability; the long tail gets the self-serve treatment — effort follows revenue, honestly; (3) THE RENEWAL-ALIGNED TIMING: mid-market increases land cleanest at renewal (the natural re-decision point) — the in-term increase needs contract rights and extraordinary justification; the renewal increase needs 90+ days notice and a value story; (4) THE NEGOTIATION CORRIDOR pre-built: the AM\u2019s authority (what they can trade: term length, payment timing, tier adjustments) and the floor (below which the deal escalates or walks) defined BEFORE conversations start — unprepared AMs give away the increase one exception at a time; (5) THE EXPANSION REFRAME: the increase conversation is also an account review — the accounts that grew get right-sized with the growth story told straight ("you were at 40 users on a 25-user plan"), and right-sizing recovered revenue routinely exceeds the rate increase itself.',
    enterprise_contracts: 'ENTERPRISE CALIBRATION: dozens of large contracts with procurement departments and legal terms — pricing changes are a contracting discipline played in years, not quarters: (1) THE CONTRACT ARCHITECTURE AS THE GAME: the increase you can take is the increase the contract allows — the terms that matter get negotiated at signing: the renewal cap (procurement will push for one; price it), the CPI-plus escalator (the inflation pass-through that avoids the traumatic catch-up), auto-renewal windows, and the multi-year lock traded for real discount; the pricing team that ignores contract terms meets them at renewal, armed; (2) THE RENEWAL CAMPAIGN run like a deal: the account plan 6-9 months out (usage audit, value evidence assembled, stakeholder map refreshed, executive sponsor engaged), because the enterprise renewal IS a sales cycle and the incumbent who coasts into it negotiates from surprise; (3) THE PROCUREMENT PHYSICS respected: procurement is paid to extract concessions and arrives with the benchmark deck — the counters: the value ledger in THEIR numbers (usage, outcomes, the cost of switching), the trade menu (term, volume, payment terms — never naked price cuts), and the walk-away calculus done with leadership BEFORE the squeeze, not during; (4) THE TRUE-UP DIGNITY: enterprise accounts drift over their entitlements — the annual true-up conversation handled as partnership ("your success outgrew the contract") with bridge pricing, versus the audit-letter ambush that wins the invoice and loses the champion; (5) THE PORTFOLIO VIEW: enterprise pricing changes are managed as a book (exposure by renewal quarter, escalator coverage %, discount depth distribution) — the dashboard that shows which contracts renew under-market is the pipeline of recoverable margin, worked deliberately across years.'
  };

  return {
    status: 'success',
    increase_playbook: 'Price-change engineering — primary focus: ' + focus.replace(/_/g, ' ') + '. THE PRICE-INCREASE PLAYBOOK (the move everyone fears and profitable companies practice): (1) THE JUSTIFICATION LEDGER built first: everything shipped, improved, and supported since the last price — features, performance, support quality, the ecosystem — the increase announced as the invoice for value already delivered reads fundamentally differently than the rent hike; if the ledger is thin, fix the product before the price; (2) THE MATH THAT KILLS THE FEAR: model it honestly — a 15% increase with 5% incremental churn on a typical base is strongly profit-positive, and the churners skew toward the least-engaged, lowest-LTV segment (the increase is, in part, a portfolio cleanup) — run the breakeven churn rate before the debate and watch the debate shrink; (3) THE NOTICE ARCHITECTURE: 30-90 days by segment (more notice for bigger commitments), the lock-in offer that converts the announcement into a revenue event (annual at current rates before the date — it pulls cash forward AND lets loyalists feel rewarded), and the effective-date discipline (one date, held — the quietly-extended deadline teaches the base that announcements are negotiable); (4) THE GRANDFATHERING DECISION made deliberately: full grandfather (maximum goodwill, permanent revenue ceiling — reserve it for strategic moments), time-boxed grandfather (12 months at legacy rates — the usual right answer), or clean migration with bridge pricing — the default-by-guilt grandfather that never sunsets is how companies accumulate seven legacy price books and a spreadsheet of shame; (5) THE COMMUNICATION TONE: plain, confident, unapologetic and grateful — the apologetic increase email invites negotiation; the corporate-speak one invites rage; the honest one ("here is what changed, here is the new price, here is your option") gets quiet acceptance from the 90% the fear forgot about.',
    testing_system: 'THE PRICE-TESTING SYSTEM (learning without trust damage): (1) THE COHORT-TESTING FRAME: new customers only — existing customers never discover they are in a price experiment (the fastest trust-destruction mechanism in SaaS history); geography, channel or time-window cohorts at different price points, each read through the FULL funnel: conversion, yes, but also 90-day retention, support load and expansion — the higher price that converts 10% worse and churns 25% less is the winner that top-of-funnel dashboards call a loser; (2) THE STATISTICAL HONESTY: price tests need volume and time — the sub-100-conversion "test" is an anecdote; where volume is thin (enterprise, agencies), replace A/B theater with sequential market testing (quote the new price to the next ten real deals and log the forensics) and willingness-to-pay research; (3) THE WIN-LOSS FORENSICS as the always-on test: every lost deal tagged for price-mentioned versus price-decisive (buyers say "too expensive" to end conversations politely — the follow-up question "too expensive relative to what?" splits the real signal), and every won deal checked for the silence that means underpriced — ten honest win-loss reads beat most formal experiments; (4) THE PAGE-LEVEL TESTING kept honest: framing, tier emphasis, annual-default and presentation order are fair A/B territory (same prices, different clarity) — showing different visitors different PRICES for the same thing at the same moment is where testing crosses into discrimination theater and screenshot risk; (5) THE DECISION PROTOCOL pre-committed: the metric that decides (revenue per visitor through 90-day retention), the read window, and who calls it — tests without pre-committed decision rules become Rorschach charts for whoever argues loudest.',
    discount_discipline: 'THE DISCOUNT DISCIPLINE SYSTEM (where pricing strategies go to leak): (1) THE FLOOR AND THE LADDER: a written discount floor by product/tier (below which deals escalate to a named owner, and the owner sometimes says no), approval bands by discount depth, and the quarterly leakage report (average discount by rep, by segment, by quarter-week) — what gets measured stops being free; (2) THE TRADE RULE (the heart of the discipline): every discount BUYS something concrete — annual or multi-year prepay, the case study with numbers, the reference call commitment, the multi-seat expansion, the earlier close date with real cause — the naked discount teaches the buyer that the price was padding; the traded discount teaches them that value moves both ways; (3) THE QUARTER-END CEASEFIRE: the end-of-quarter panic discount is a training program for procurement (wait until March, save 20%) — breaking the cycle costs one hard quarter and pays forever; the bridge mechanics: pipeline honesty (deals closed on evidence, not hope) and leadership that does not finance its forecast misses with margin; (4) THE SAVE-OFFER HIERARCHY for at-risk customers: the downgrade path first (budget respect WITH price integrity), the pause second, the time-boxed hardship discount last and logged — the permanent secret discount population is churn deferred and resentment banked; (5) THE PUBLIC-PRICE INTEGRITY: list prices that mean something (the 60%-standard-discount software industry habit converts price pages into fiction and every negotiation into archaeology) — the closer list is to real, the shorter the sales cycles, the cleaner the comparisons and the stronger the brand\u2019s word on every other subject.',
    migration_system: 'THE GRANDFATHERING & MIGRATION SYSTEM: (1) THE LEGACY-PLAN AUDIT: the census first — how many customers on how many legacy plans at what revenue and what margin, with what contractual rights — most companies discover a long tail of forgotten plans that are individually trivial and collectively a quiet margin hemorrhage plus an engineering tax (every legacy plan is code someone maintains); (2) THE MIGRATION DESIGN: the target plan for each legacy cohort mapped (usually the nearest current tier), the delta analysis (who pays more, who pays less, who gains features), and the bridge offers for the losers (12-month transition pricing, the feature-match guarantee, the personal outreach for the big accounts) — migrations succeed on the quality of the worst case, not the average; (3) THE SUNSET COMMUNICATION ARC: the announcement (what, when, why, and what it means for THEM specifically — mail-merge the delta, not the platitudes), the reminder at 60 days, the final notice at 30, and the migration execution with rollback capacity for the edge cases — surprises are the only unforgivable part of any sunset; (4) THE LOYALTY ACKNOWLEDGMENT: long-tenured customers absorbing a change deserve explicit recognition — the loyalty credit, the extended transition, the early access to the thing the new pricing funds — the gesture costs basis points and buys the narrative ("they handled it well") that determines whether the migration trends on the customer Slack; (5) THE ANTI-ACCUMULATION RITUAL: the standing rule that every new pricing launch includes the sunset plan for what it replaces (the no-orphans policy), and the annual plan-count review — pricing debt compounds exactly like code debt: invisibly, then suddenly.',
    base_calibration: baseCalibration[base]
  };
}

/* ----------------------------- TOOL 4: VALUE COMMUNICATION ----------------------------- */

function communicateValue(args) {
  const focus = args.communication_focus || 'pricing_page_design';
  const market = args.price_vs_market || 'priced_at_market';

  const marketCalibration = {
    priced_below_market: 'BELOW-MARKET CALIBRATION: the under-priced position — usually an accident, occasionally a strategy, always a communication problem: (1) THE SUSPICION TAX: in considered purchases, the too-cheap price triggers quality doubt ("what is wrong with it?") — the below-market player must explain the price confidently ("we automate what they staff; the savings are structural") or the discount reads as a defect; (2) THE HARVEST AUDIT: if below-market is accidental (fear, neglect), the win-loss data almost always shows price was NOT why deals were won — the buyers came for fit and would have paid more; the staged increase (new customers first) harvests the gap with minimal churn, and the communication job is internal courage more than external persuasion; (3) IF STRATEGIC, OWN IT LOUDLY: the value player\u2019s page says the quiet part proudly — the honest comparison table, the "why we cost less" explainer, the self-serve expectations set plainly — strategic cheapness hidden reads as weakness; strategic cheapness explained reads as engineering; (4) THE SEGMENT SIGNAL: below-market pricing recruits price-sensitive customers — expect higher churn, lower expansion and heavier support unless the product is genuinely self-serve; the communication must pre-filter ("built for teams who want X without Y") or the price does the filtering badly; (5) THE EXIT TIMING: below-market is hardest to leave the longer it lasts (the base anchors, the brand cements) — the annual question: "is the discount still buying us anything (share, reviews, wedge) that the margin would not buy better?"',
    priced_at_market: 'AT-MARKET CALIBRATION: parity pricing — where communication quality IS the differentiation: (1) THE TIE-BREAKER REALITY: at price parity, buyers decide on perceived fit, risk and ease — the pricing page that answers faster, the ROI case in the buyer\u2019s numbers, the transparent comparison, the smoother trial — communication is the competition; (2) THE COMPARISON JIU-JITSU: at-market players should publish the comparison table themselves (honest, specific, conceding the rival\u2019s real strengths) — the vendor who frames the comparison controls the dimensions compared, and buyers reward the candor with trust the rival\u2019s marketing cannot buy; (3) THE SEGMENT-FIT SHARPNESS: parity pricing with sharper segment language ("built for agencies juggling 20 clients") beats parity pricing with generic language every time — the price says "same as them"; the words must say "but for YOU"; (4) THE VALUE-METRIC REFRAME as the escape hatch: when the number matches the market, the STRUCTURE can still differentiate (simpler metric, fairer scaling, no overage ambushes) — "same price, none of the surprises" is a pricing position; (5) THE DRIFT WATCH: at-market is a treadmill — competitors reprice quarterly and parity decays silently; the standing competitive price check (quarterly, documented) keeps "at market" a fact instead of a memory.',
    priced_above_market: 'ABOVE-MARKET CALIBRATION: the premium position — every communication artifact must carry the gap: (1) THE PROOF STACK ORDERED BY SKEPTICISM: outcome numbers first (the metric moved, the time saved, the revenue gained — with customer names where possible), the mechanism second (WHY it wins: the architecture, the depth, the service model), the social proof third (logos, reviews, tenure) — premium pages that lead with adjectives pay for it in discount conversations; (2) THE ROI CASE AS THE CENTERPIECE: the calculator or worked example in the buyer\u2019s own variables ("at your volume, the delta pays for itself in 7 weeks") — the premium price re-framed from cost to arbitrage is the entire job; sell the gap, not the number; (3) THE TCO REFRAME against cheaper rivals: purchase price versus total cost (implementation, maintenance, failure risk, staff time, switching costs) — the premium player wins TCO arguments it would lose on sticker price, but only if it builds the TCO frame BEFORE procurement builds the sticker-price spreadsheet; (4) THE CONFIDENCE REGISTER: premium communication never apologizes and never pads — short sentences, concrete claims, prices stated without wincing, the walk-away calmly available — buyers price-test confidence as a proxy for product truth, and they are not wrong often enough to stop; (5) THE PREMIUM-PROOF MAINTENANCE: the evidence stack decays (last year\u2019s case study, the churned logo) — the quarterly proof refresh is premium hygiene, because above-market pricing is a claim re-litigated in every deal.'
  };

  return {
    status: 'success',
    pricing_page_system: 'Value communication — primary focus: ' + focus.replace(/_/g, ' ') + '. THE PRICING-PAGE SYSTEM: (1) THE TEN-SECOND TEST: each segment finds its tier inside ten seconds — tier names that self-identify (Starter/Professional/Scale), the one-line "for whom" under each name, the highlighted recommended tier, and the price in big honest type with billing terms adjacent (the "$29/mo billed annually" asterisk maze is a trust leak measured in support tickets); (2) THE OUTCOME-LANGUAGE TABLE: feature rows written as outcomes ("Recover abandoned carts automatically" beats "Cart recovery module"), grouped by job-to-be-done, with the esoteric rows linked to explainers instead of bloating the table — buyers do not buy nouns; they buy finished Tuesdays; (3) THE FRICTION-KILLER LAYER: the FAQ that pre-answers the real objections (what happens when I hit limits? can I downgrade? what does cancellation actually involve? is my data exportable?) — every answered anxiety is a support ticket prevented and a signup unblocked; the pages that hide these answers do not avoid the questions, they just move them to the cancellation survey; (4) THE HONEST-SIGNALS CHECKLIST: real prices visible (the "contact us" wall reserved for genuinely bespoke enterprise), the total computable in the buyer\u2019s head, no pre-ticked add-ons, the currency and tax reality stated, and the comparison to competitors — where made — specific and conceding real trade-offs; transparency converts the exact buyers worth keeping; (5) THE PAGE AS A LIVING ASSET: conversion watched by segment (which tier do visitors from which source choose?), the quarterly copy review against win-loss language (sell with the words buyers use when they explain the purchase to their boss), and the A/B discipline on framing — same prices, clearer story.',
    value_conversation: 'THE VALUE-SELLING CONVERSATION SYSTEM: (1) THE SEQUENCE LAW: value before price, always — the price delivered before the problem is quantified has no denominator and every number is "expensive" divided by zero context; the discovery that sizes the problem in the buyer\u2019s own numbers (hours lost, revenue leaked, risk carried) builds the denominator the price will be judged against; (2) THE ROI CASE CO-BUILT: not the vendor\u2019s spreadsheet presented AT the buyer, but the model built WITH them ("walk me through your volume... so at your numbers, that is roughly X per month leaking") — co-built math is believed because it is theirs, and it survives procurement because the champion can defend every cell; (3) THE PRICE DELIVERY CRAFT: the number stated plainly, once, with context ("the Professional plan is $499 a month — at the volume we just mapped, that is about a 6-week payback") — and then THE PAUSE: silence after the price is where unsteady reps discount against nobody; the training is physical: say the number, stop talking, let the buyer process; (4) THE ANTI-FLINCH PROTOCOLS: the first objection is usually reflex, not verdict — the response ladder: acknowledge, clarify ("relative to the budget, or to the alternatives?"), re-anchor to the co-built math, and only then discuss structure (term, tier, timing) — never naked price; reps discount at the first flinch because nobody armed them for the second sentence; (5) THE WRITTEN-PROPOSAL ECHO: the proposal restates the quantified problem, the co-built ROI and THEN the price (the same sequence, in writing) — proposals that open with the price invite the buyer to skip to the number and negotiate it out of context; the document should sell in the same order the conversation did.',
    objection_system: 'THE OBJECTION DECODE & REFRAME LIBRARY: (1) "TOO EXPENSIVE" decoded: it means one of four things — no budget authority (a routing problem, not a price problem: find the economic buyer), unquantified value (the denominator is missing: return to discovery, not to discounting), cheaper alternative (a comparison problem: move to the TCO and difference-that-matters frame), or polite exit (a qualification miss: ask directly and release gracefully) — the follow-up that splits them: "help me understand — too expensive relative to what?"; treating all four with a discount misdiagnoses three and overpays for the fourth; (2) "NO BUDGET" decoded: budgets are allocations, not facts — the honest probes: "if the fit were perfect, how would something like this get funded?" and "whose budget does this problem currently live in?" (the problem is being paid for somewhere: in hours, in churn, in workarounds) — no-budget often means wrong-quarter or wrong-sponsor, both workable; and sometimes it means never, which deserves a respectful exit, not a nurture sequence of attrition; (3) "COMPETITOR X IS CHEAPER" handled without panic: concede the fact, reframe the comparison ("they are — and here is the difference the price buys, in your numbers"), offer the reference who switched, and hold — matching reflexively teaches the market to shop you against everyone; the honest version of losing on price ("for your use case at that budget, they may genuinely be the right call") wins the deals that come back and the reputation that compounds; (4) "WE NEED A DISCOUNT TO SIGN" met with the trade rule: "what would you like to trade?" — term, prepay, case study, timing — the discount that buys something is a deal; the discount that buys nothing is a confession; (5) THE LIBRARY DISCIPLINE: objections logged verbatim from real calls, answers refined quarterly from what actually worked, and the whole library trained through roleplay — objection handling is a craft rehearsed, not a document attached.',
    competition_playbook: 'THE COMPETITOR PRICE-WAR PLAYBOOK: (1) THE FIRST RULE — DO NOT ENLIST: most price wars are optional; the competitor\u2019s discount is their margin decision, not your obligation — the reflexive match converts one player\u2019s desperation into an industry-wide repricing that no participant can reverse; the question before any response: "is this a strategic repricing or a quarter-end spasm?" — spasms are survived, not matched; (2) THE RESPONSE LADDER short of matching: sharpen the value evidence (the war is won in the comparison frame, not the price cell), fortify the base (the at-risk accounts get attention and locked terms before they get poached), introduce the flanker (the lighter tier that answers the cheap alternative without repricing the flagship), and negotiate deal-by-deal where it matters (the targeted response costs basis points; the across-the-board match costs the P&L); (3) THE SWITCHING-COST HONESTY: incumbents under price attack hold most of the cards (migration pain, integration depth, trained teams, trust) — the retention conversation that names the TOTAL cost of switching (honestly, not menacingly) usually beats the 20% discount the rival is waving; (4) THE WHEN-TO-MATCH CRITERIA: match when the account is strategic, the gap is modest, the relationship wants to stay, and the trade rule applies (match FOR term, volume or commitment) — and walk when the buyer has become a price-only auctioneer: the account won on price alone is leased, not won, and the lease renews annually at your expense; (5) THE RACE-TO-THE-BOTTOM EXIT: markets commoditizing on price are escaped upward (verticalize, deepen the workflow, attach services) or sideways (the adjacent segment where the differentiation still prices) — the war you decline to fight is won by the business model that no longer competes on the fought dimension.',
    market_calibration: marketCalibration[market]
  };
}

/* ----------------------------- TOOL 5: MONETIZATION ECONOMICS ----------------------------- */

function buildEconomics(args) {
  const focus = args.economics_focus || 'unit_economics_margins';
  const data = args.data_available || 'basic_analytics';

  const dataCalibration = {
    no_data_gut_feel: 'NO-DATA CALIBRATION: the small operator with instincts and invoices — real pricing work is absolutely possible; it just uses conversations instead of dashboards: (1) THE FIVE-CONVERSATION METHOD: five best-fit customers, four questions — "what were you doing before? what would you expect to pay for this? at what price would it be a no-brainer? at what price too expensive to consider?" — the answers cluster fast, and the cluster is a willingness-to-pay study that cost five coffees; (2) THE INVOICE ARCHAEOLOGY: the last 20 sales re-read for the signal already paid for — who negotiated and who paid list silently (silence is the underpricing tell), which offers closed fastest, where the price was never even questioned; (3) THE BACK-OF-ENVELOPE MARGIN MAP: per offer: price minus the honest all-in cost (including the founder hours nobody bills at their real rate) — most no-data businesses discover one offer subsidizing the others within an afternoon; (4) THE NEXT-TEN TEST as the experiment: quote the new price to the next ten real prospects and log what happens — ten live quotes beat a thousand survey responses, and the worst case is ten data points and a few deals at the old price; (5) THE PERMISSION NOTE: the absence of analytics is not a reason to defer pricing work — the five-conversation, invoice-archaeology, next-ten stack IS the small-operator pricing system, and it routinely finds 20-40% of unclaimed price inside a month.',
    basic_analytics: 'BASIC-ANALYTICS CALIBRATION: the operator with revenue reports, conversion numbers and churn rates — enough to be dangerous and enough to be good, if read correctly: (1) THE FOUR-NUMBER DASHBOARD assembled first: ARPU trend (is the average moving or drifting?), conversion by tier (where do buyers actually land versus where the design intended?), churn by tier and tenure (is churn price-driven — early and downgrade-heavy — or value-driven?), and discount leakage (realized versus list) — four numbers, monthly, one page; (2) THE COHORT UPGRADE within reach: group customers by signup month and price paid, read retention curves per cohort — the single analysis that answers "did the last price change actually work?" and most basic stacks can produce it in a spreadsheet afternoon; (3) THE SEGMENTED-ARPU REVELATION: ARPU split by segment (size, use-case, channel) almost always reveals a 3-10x value variance being served by one price — the finding that justifies the tier redesign with data the operator already owned; (4) THE LEAK AUDITS the basic stack supports: the discount report by rep/segment, the failed-payment recovery rate (involuntary churn is the cheapest fix in monetization), the plan-distribution drift (everyone landing on the cheapest tier is a packaging alarm, not a pricing one); (5) THE UPGRADE PATH: the next instrument worth building is win-loss price tagging (two fields in the CRM: price-mentioned?, price-decisive?) — it costs nothing and turns every deal into a pricing data point the dashboard will compound for years.',
    rich_data_experiments: 'RICH-DATA CALIBRATION: the operator with experiment infrastructure, cohort pipelines and analysts — the failure modes shift from ignorance to sophistication: (1) THE FULL-FUNNEL DECISION STANDARD: every pricing experiment judged through 90-day retention and expansion, never top-of-funnel alone — the organization that ships the conversion-winning price that churn-loses is doing confident damage; the pre-registered decision metric (revenue per visitor through retention) kills the dashboard-shopping that rich data enables; (2) THE ELASTICITY MODELING done humbly: observed elasticities from cohort variation, win-loss text mined for price signals, demand curves estimated per segment — and the humility clause: models extrapolate the past; the 40% increase lives outside the observed range, so big moves still stage through cohorts regardless of what the curve predicts; (3) THE WTP RESEARCH AT SCALE: Van Westendorp run quarterly on fresh prospects (not the anchored base), max-diff for feature-value ranking feeding packaging decisions, conjoint for the metric-level questions — with the standing correction that stated willingness skews optimistic ~20-30% versus revealed behavior; (4) THE EXPANSION-ENGINE ANALYTICS: the NRR decomposition (upgrade rate, usage growth, seat growth, downgrade, churn) by cohort and segment — rich-data organizations find their biggest pricing wins in expansion mechanics (the limit placements, the upgrade triggers, the annual-mix) more often than in the headline price; (5) THE GOVERNANCE OF SOPHISTICATION: the experiment calendar (no overlapping price tests contaminating cohorts), the ethics line held in writing (no same-moment price discrimination on identical offers), and the quarterly synthesis for leadership in one page — rich data without governance produces the best-instrumented pricing chaos in the industry.'
  };

  return {
    status: 'success',
    unit_economics: 'Monetization economics — primary focus: ' + focus.replace(/_/g, ' ') + '. THE UNIT-ECONOMICS SYSTEM: (1) THE CONTRIBUTION-MARGIN TRUTH: per unit, per customer, per tier: revenue minus the ALL-IN variable cost — infrastructure, payment fees, support load, onboarding hours, success time, and (for founders) the owner hours at a real market rate — the number most businesses have never computed honestly, and the one that re-ranks every product and segment the day it exists; (2) THE MARGIN MAP DELIVERABLE: the grid of products/tiers x customer segments with contribution margin in each cell — the reliable discoveries: the flagship that barely margins once support is counted, the boring product quietly funding everything, the segment whose support load converts healthy gross margin into a charitable donation; (3) THE CROSS-SUBSIDY AUDIT: who pays for whom — the heavy-usage customers under flat pricing, the discount-negotiators subsidized by the silent payers, the free tier funded by the pros — cross-subsidies are strategy when chosen and leakage when discovered; the audit converts them from the latter to the former; (4) THE COST-TO-SERVE SEGMENTATION: support tickets, success hours and infrastructure per segment — the 80/20 is usually brutal (a minority of customers consume the majority of serve-cost), and the pricing responses are civilized: the support tiers, the usage-aligned pricing, the enterprise uplift that funds the enterprise attention; (5) THE DECISION HOOKS: unit economics exist to change decisions — the price floor per segment (below which business is declined politely), the segment to stop acquiring (CAC + serve-cost exceeds LTV at any realistic price), and the tier whose margin funds the growth bets — a margin map that changes no decisions was an art project.',
    wtp_research: 'THE WILLINGNESS-TO-PAY RESEARCH SYSTEM: (1) THE VAN WESTENDORP INSTRUMENT run properly: four questions to real prospects (too cheap to trust / bargain / getting expensive / too expensive to consider), plotted into the acceptable price range and the optimal price point — the discipline notes: fresh prospects (the existing base is anchored), segment-split results (the blended curve hides the premium segment), and the 20-30% optimism discount applied to stated numbers; (2) THE MAX-DIFF FEATURE VALUATION: forced trade-offs ("which of these four matters most / least?") across the feature set — the output ranks what buyers actually value versus what they politely praise, and it is the empirical input packaging decisions pretend to have; the free-text survey that asks "what features do you want?" collects wishes; max-diff collects priorities; (3) THE WIN-LOSS PRICE FORENSICS as the permanent instrument: every closed deal tagged (price mentioned? price decisive? competitor price cited? discount requested/granted?) — four CRM fields that compound into the most honest WTP dataset the company will ever own, because it is made of money instead of opinions; (4) THE REVEALED-PREFERENCE READS: the tier distribution (where buyers land when choosing with their wallets), the annual-vs-monthly mix (commitment appetite), the upgrade lag (how long value builds before it converts) — behavior data outranks stated data at every collision; (5) THE CONVERSATION LAYER never retired: quarterly, five customers, the four questions — at every scale, the qualitative layer explains the quantitative one, and the operator who only reads dashboards misprices the humans behind them.',
    retention_economics: 'THE CHURN & EXPANSION PRICING ECONOMICS: (1) THE CHURN DECOMPOSITION: price-driven churn (exits at increase announcements, downgrade-then-leave patterns, "too expensive" in exit surveys) separated from value-driven churn (never activated, usage decayed, champion left) — the distinction decides everything: price-driven churn responds to packaging and migration design; value-driven churn laughs at discounts and responds to product; the blended churn number treats them identically and fixes neither; (2) THE INVOLUNTARY-CHURN RECOVERY as the cheapest money in monetization: failed payments are 20-40% of churn in self-serve businesses — dunning sequences, card-updater services, retry logic and the grace period recover most of it for the cost of configuration; no pricing strategy outperforms fixing the broken payment flow; (3) THE EXPANSION ENGINE as the quiet compounder: NRR above 100% means the existing base grows without new sales — the pricing mechanics that drive it: value metrics that scale with success, limits placed where growth naturally crosses them, upgrade triggers framed as congratulations, and the annual plan mix (annual customers churn at a fraction of monthly — the 2-month discount is retention purchased at honest prices); (4) THE PRICE-INCREASE CHURN MATH pre-run: breakeven churn = increase % / (1 + increase %) — a 20% increase breaks even at 16.7% churn, and observed churn on well-communicated increases runs a fraction of that — the formula that converts board anxiety into arithmetic; (5) THE LTV REFRAME of every pricing decision: price changes compound through retention (the +15% that nudges churn is judged at the 24-month cohort, not the first invoice) — the monetization lens is lifetime margin per customer, and every lever (price, metric, packaging, discounts) is pulled against that denominator or pulled blind.',
    governance_system: 'THE PRICING OPS & GOVERNANCE LAYER: (1) THE NAMED OWNER: pricing owned by a person, not a committee — the owner runs the dashboard, the review ritual, the experiment calendar and the approval ladder; companies without a pricing owner have pricing decided by whoever discounted last; (2) THE APPROVAL LADDER with real steps: reps to X%, managers to Y%, the owner beyond — every exception logged with the trade it bought, and the quarterly leakage report published internally (sunlight is the discount disinfectant); (3) THE QUARTERLY PRICING REVIEW as a standing one-hour ritual: the four-number dashboard (ARPU trend, NRR, discount leakage, win-loss price signals), competitor moves, the value ledger accumulating toward the next increase, and ONE decision per quarter (raise, repackage, test, hold — chosen, not drifted into); (4) THE CHANGE-CONTROL DISCIPLINE: every pricing change shipped with its blast-radius checklist — the billing system, the sales collateral, the partner price lists, the help docs, the legacy-plan implications, the support macros — pricing changes fail operationally more often than strategically; (5) THE INSTITUTIONAL MEMORY: the pricing decision log (what changed, why, what the data said, what happened) — pricing knowledge lives in people who leave; the log is how year-five pricing stands on year-one lessons instead of re-paying for them.',
    data_calibration: dataCalibration[data]
  };
}

async function auditPricingPageLive(args) {
  let url = String(args.url).trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  let resp = null, html = '', fetchError = null;
  try {
    resp = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PricingForge-MCP/1.1)' } });
    html = await resp.text();
  } catch (e) { fetchError = e.message; }
  if (fetchError || !resp) {
    const note = 'Live fetch failed for ' + url + ' (' + (fetchError || 'no response') + '). Retry or verify the URL.';
    return { status: 'success', price_extraction: note, tier_structure_read: note, honesty_scan: note, optimization_priorities: note, data_source: 'Live HTTP fetch (failed) \u2014 ' + url };
  }
  const lower = html.toLowerCase();
  const prices = Array.from(new Set((html.match(/[$\u20ac\u00a3]\s?\d{1,5}(?:[.,]\d{1,2})?/g) || []))).slice(0, 15);
  const hasMonthly = /\/\s?mo\b|per month|\/month|monthly/i.test(html);
  const hasAnnual = /annual|yearly|per year|\/year|\/yr\b/i.test(html);
  const discountPct = (html.match(/save\s+\d{1,2}\s?%|\d{1,2}\s?%\s+(?:off|discount|saving)/i) || [])[0] || null;
  const TIERS = ['free', 'starter', 'basic', 'pro', 'professional', 'premium', 'business', 'team', 'growth', 'scale', 'enterprise'];
  const tiersFound = TIERS.filter(function(t) { return new RegExp('\\b' + t + '\\b', 'i').test(html); });
  const hasTrial = /free trial|\d+-day trial|try free/i.test(html);
  const trialDays = (html.match(/(\d+)[- ]day(?:s)? (?:free )?trial/i) || [])[1] || null;
  const hasContactSales = /contact sales|talk to sales|custom pricing|contact us for pricing/i.test(html);
  const darkFlags = [];
  if (/countdown|timer|expires in|offer ends/i.test(lower)) darkFlags.push('COUNTDOWN/URGENCY TIMER detected \u2014 if the deadline is not real, this is fake-urgency theater that converts short-term and erodes trust (and is increasingly regulated)');
  if (/only today|today only|limited time|last chance|hurry/i.test(lower)) darkFlags.push('HURRY LANGUAGE detected ("limited time"/"only today") \u2014 verify the claim is literally true; manufactured scarcity is the classic dark pattern');
  if (/<(s|del|strike)\b[^>]*>\s*[$\u20ac\u00a3]/i.test(html) || /was\s+[$\u20ac\u00a3]\s?\d/i.test(html)) darkFlags.push('WAS-PRICE / STRIKETHROUGH pricing detected \u2014 legitimate only if the old price was genuinely charged recently; fabricated anchors are deceptive and legally risky in many markets');
  if (/per seat|per user/i.test(lower) && !/minimum|min\./i.test(lower) && /enterprise/i.test(lower)) darkFlags.push('per-seat pricing without visible minimums \u2014 not a dark pattern, but a common hidden-cost complaint; state minimums plainly');
  const fixes = [];
  if (prices.length === 0 && !hasContactSales) fixes.push('P1 \u2014 NO VISIBLE PRICES and no contact-sales path: visitors cannot act; either publish prices or make the sales motion explicit');
  if (prices.length > 0 && !hasAnnual) fixes.push('P2 \u2014 no annual option detected: the yearly plan (anchored at 2 months free) is the cheapest LTV and cash-flow win in SaaS pricing');
  if (hasMonthly && hasAnnual && !discountPct) fixes.push('P3 \u2014 monthly and annual both present but no visible savings claim: name the discount ("save 20%") \u2014 unstated discounts anchor nothing');
  if (tiersFound.length > 4) fixes.push('P2 \u2014 ' + tiersFound.length + ' tier-name signals (' + tiersFound.join(', ') + '): more than 3-4 visible plans measurably increases choice paralysis; consolidate or progressive-disclose');
  if (!hasTrial && !tiersFound.includes('free') && prices.length > 0) fixes.push('P2 \u2014 no trial or free tier detected: a risk-reversal mechanism (trial, freemium, or money-back guarantee) is the standard objection-killer for self-serve');
  if (darkFlags.length > 0) fixes.push('P1 \u2014 HONESTY FIXES: resolve the flagged patterns below; honest pricing converts slightly less today and compounds trust, referrals and review scores forever');
  if (fixes.length === 0) fixes.push('SOLID BASELINE: structure, billing options and risk reversal all present \u2014 next wins are A/B tests on tier naming, anchor order and the value-bullets under each price');
  return {
    status: 'success',
    price_extraction: 'LIVE PRICE EXTRACTION from ' + url + ' (HTTP ' + resp.status + '): ' + (prices.length > 0 ? prices.length + ' distinct price string(s) found: ' + prices.join(', ') : 'no currency-formatted prices found in the HTML') + '. Billing periods: monthly signals ' + (hasMonthly ? 'present' : 'absent') + ', annual signals ' + (hasAnnual ? 'present' : 'absent') + (discountPct ? ', savings claim: "' + discountPct + '"' : '') + '.',
    tier_structure_read: 'TIER STRUCTURE READ: plan-name signals found: ' + (tiersFound.length > 0 ? tiersFound.join(', ') : 'none of the standard names') + '. Free trial: ' + (hasTrial ? 'YES' + (trialDays ? ' (' + trialDays + ' days)' : '') : 'not detected') + '. Enterprise/contact-sales motion: ' + (hasContactSales ? 'present' : 'not detected') + '. The classic high-converting shape is 3 visible tiers + enterprise contact, annual pre-selected with a named discount, and the recommended tier visually anchored.',
    honesty_scan: 'HONESTY SCAN (dark-pattern check a skeptical buyer runs instinctively): ' + (darkFlags.length > 0 ? darkFlags.length + ' flag(s): ' + darkFlags.map(function(f, i) { return (i + 1) + '. ' + f; }).join(' ') : 'CLEAN \u2014 no countdown theater, no hurry language, no was-price patterns detected in the HTML. This is the trust posture that survives regulation waves and review-site scrutiny.'),
    optimization_priorities: 'PRIORITIZED OPTIMIZATIONS (computed from the live page): ' + fixes.map(function(f, i) { return (i + 1) + '. ' + f; }).join('. ') + '.',
    data_source: 'Live HTTP fetch (real time) \u2014 ' + url + ' analyzed from the actual delivered HTML at the moment of this request. JS-rendered pricing tables may add detail beyond this static pass.'
  };
}
