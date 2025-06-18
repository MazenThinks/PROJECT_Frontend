// Enhanced Voice Search Functionality with Advanced AI Intelligence and Context Awareness
class EnhancedVoiceSearch {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.interimTranscript = "";
    this.finalTranscript = "";
    this.commandHistory = [];
    this.silenceTimer = null;
    this.silenceThreshold = 2500; // Reduced to 2.5 seconds for better responsiveness
    this.lastSpeechTime = 0;
    this.speechDetected = false;
    this.confidenceThreshold = 0.7; // Minimum confidence for speech recognition
    this.contextualMemory = {
      lastSearchQuery: "",
      lastCategory: "",
      userPreferences: [],
      sessionCommands: [],
      currentPage: window.location.pathname,
      conversationContext: [],
      userIntentHistory: [],
    };

    // Advanced AI models for better understanding
    this.intentClassifier = this.initializeIntentClassifier();
    this.entityExtractor = this.initializeEntityExtractor();
    this.contextAnalyzer = this.initializeContextAnalyzer();

    this.init();
  }

  // Initialize advanced intent classification with machine learning patterns
  initializeIntentClassifier() {
    return {
      patterns: {
        search: {
          keywords: [
            "search",
            "find",
            "look",
            "show",
            "get",
            "need",
            "want",
            "type",
            "enter",
          ],
          phrases: [
            /(?:search\s+for|find|look\s+for|show\s+me|get\s+me|display|bring)\s+(.*)/i,
            /(?:i\s+(?:want|need|am\s+looking\s+for))\s+(.*)/i,
            /(?:type|enter|put|write)\s+(.*?)\s*(?:in\s+(?:search|bar)?)?/i,
            /(?:can\s+you\s+(?:find|search\s+for|look\s+for))\s+(.*)/i,
            /(?:where\s+(?:can\s+i\s+find|is))\s+(.*)/i,
            /(?:give\s+me|bring\s+me)\s+(.*)/i,
          ],
          confidence: 0.9,
        },
        navigation: {
          keywords: [
            "go",
            "navigate",
            "open",
            "visit",
            "take",
            "redirect",
            "profile",
            "account",
          ],
          phrases: [
            /(?:go|navigate|take\s+me)\s+to\s+(.*)/i,
            /(?:open|show\s+me|display)\s+(?:the\s+)?(.*)\s*(?:page|section)?/i,
            /(?:i\s+want\s+to\s+(?:go\s+to|see|visit))\s+(.*)/i,
            /(?:go\s+to|open|show\s+me|take\s+me\s+to)\s+(?:my\s+)?profile/i,
            /(?:go\s+to|open|show\s+me|take\s+me\s+to)\s+(?:my\s+)?account/i,
          ],
          confidence: 0.8,
        },
        action: {
          keywords: [
            "add",
            "remove",
            "delete",
            "buy",
            "purchase",
            "checkout",
            "scroll",
          ],
          phrases: [
            /(?:add\s+(?:to\s+cart|this)|buy|purchase|order)\s*(.*)/i,
            /(?:remove|delete)\s+(?:from\s+cart)?\s*(.*)/i,
            /(?:scroll\s+(?:up|down)|go\s+(?:back|forward))/i,
            /(?:checkout|proceed\s+to\s+checkout|pay)/i,
          ],
          confidence: 0.7,
        },
        filter: {
          keywords: [
            "filter",
            "sort",
            "under",
            "over",
            "price",
            "rating",
            "brand",
          ],
          phrases: [
            /(?:filter|sort)\s+by\s+(.*)/i,
            /(?:show\s+me\s+(?:products\s+)?(?:under|below|less\s+than))\s+(\d+)/i,
            /(?:products\s+(?:above|over|more\s+than))\s+(\d+)/i,
          ],
          confidence: 0.6,
        },
      },

      classify: function (text) {
        const results = [];
        const lowerText = text.toLowerCase();

        for (const [intent, config] of Object.entries(this.patterns)) {
          let score = 0;
          let matches = [];

          // Keyword matching with context
          config.keywords.forEach((keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, "gi");
            const keywordMatches = (lowerText.match(regex) || []).length;
            if (keywordMatches > 0) {
              score += keywordMatches * 0.2;
              matches.push(keyword);
            }
          });

          // Phrase pattern matching
          config.phrases.forEach((pattern) => {
            const match = text.match(pattern);
            if (match) {
              score += 0.5;
              matches.push(match[1] || match[0]);
            }
          });

          // Context boost
          if (this.contextBoost) {
            score *= this.contextBoost(intent, text);
          }

          if (score > 0) {
            results.push({
              intent,
              confidence: Math.min(score * config.confidence, 1.0),
              matches,
              extractedContent: matches.join(" "),
            });
          }
        }

        return results.sort((a, b) => b.confidence - a.confidence);
      },
    };
  }

  // Advanced entity extraction with context awareness
  initializeEntityExtractor() {
    return {
      productCategories: {
        electronics: {
          terms: [
            "electronics",
            "electronic",
            "tech",
            "technology",
            "gadgets",
            "devices",
          ],
          subcategories: {
            mobile: [
              "mobile",
              "phone",
              "smartphone",
              "tablet",
              "iphone",
              "ipad",
              "samsung",
              "apple",
              "galaxy",
              "android",
              "ios",
            ],
            tv: [
              "tv",
              "television",
              "smart tv",
              "monitor",
              "display",
              "screen",
              "lg",
              "sony",
              "samsung",
            ],
            laptop: [
              "laptop",
              "computer",
              "notebook",
              "macbook",
              "dell",
              "hp",
              "lenovo",
              "gaming laptop",
              "ultrabook",
            ],
          },
        },
        appliances: {
          terms: ["appliances", "appliance", "home appliances"],
          subcategories: {
            washing: [
              "washing machine",
              "washer",
              "automatic washing machine",
              "laundry",
            ],
            kitchen: [
              "refrigerator",
              "fridge",
              "freezer",
              "microwave",
              "oven",
              "dishwasher",
            ],
            small: [
              "air fryer",
              "toaster",
              "blender",
              "coffee maker",
              "kettle",
              "iron",
            ],
          },
        },
        fashion: {
          terms: [
            "fashion",
            "clothes",
            "clothing",
            "apparel",
            "wear",
            "outfit",
          ],
          subcategories: {
            shoes: ["shoes", "sneakers", "boots", "sandals", "heels", "flats"],
            clothing: [
              "shirt",
              "pants",
              "dress",
              "jacket",
              "jeans",
              "sweater",
              "t-shirt",
            ],
            accessories: [
              "bag",
              "handbag",
              "wallet",
              "belt",
              "watch",
              "jewelry",
            ],
          },
        },
        beauty: {
          terms: [
            "beauty",
            "cosmetics",
            "skincare",
            "makeup",
            "fragrance",
            "perfume",
          ],
          subcategories: {
            makeup: [
              "lipstick",
              "foundation",
              "mascara",
              "eyeshadow",
              "concealer",
            ],
            skincare: [
              "moisturizer",
              "cleanser",
              "serum",
              "sunscreen",
              "toner",
            ],
            fragrance: ["perfume", "cologne", "eau de parfum", "fragrance"],
          },
        },
        home: {
          terms: [
            "home",
            "furniture",
            "decor",
            "decoration",
            "kitchen",
            "dining",
            "bedding",
          ],
          subcategories: {
            furniture: ["sofa", "chair", "table", "bed", "desk", "cabinet"],
            decor: ["lamp", "light", "lighting", "mirror", "picture", "art"],
            kitchen: ["cookware", "utensils", "plates", "cups", "bowls"],
          },
        },
        videogames: {
          terms: ["video games", "games", "gaming", "console", "controller"],
          subcategories: {
            console: [
              "playstation",
              "ps5",
              "ps4",
              "xbox",
              "nintendo",
              "switch",
            ],
            accessories: ["controller", "headset", "charging station", "games"],
          },
        },
      },

      brands: {
        electronics: [
          "apple",
          "samsung",
          "sony",
          "lg",
          "dell",
          "hp",
          "lenovo",
          "xiaomi",
        ],
        appliances: [
          "black & decker",
          "panasonic",
          "zanussi",
          "tornado",
          "fresh",
        ],
        fashion: ["nike", "adidas", "aldo", "timberland", "defacto"],
        beauty: ["loreal", "maybelline", "garnier", "eva", "memwa"],
        home: [
          "golden life",
          "furgle",
          "golden lighting",
          "pasabahce",
          "banotex",
        ],
      },

      colors: [
        "black",
        "white",
        "red",
        "blue",
        "green",
        "yellow",
        "pink",
        "purple",
        "brown",
        "gray",
        "grey",
        "silver",
        "gold",
        "rose gold",
      ],

      priceIndicators: [
        /(?:under|below|less than|cheaper than|maximum)\s*(\d+)/i,
        /(?:above|over|more than|expensive than|minimum)\s*(\d+)/i,
        /(?:between|from)\s*(\d+)\s*(?:to|and|-)\s*(\d+)/i,
        /(\d+)\s*(?:to|-)?\s*(\d+)?\s*(?:pounds?|egp|dollar?)/i,
      ],

      extract: function (text) {
        const entities = {
          categories: [],
          subcategories: [],
          products: [],
          brands: [],
          colors: [],
          priceRange: null,
          specifications: [],
          intent_confidence: 0,
        };

        const lowerText = text.toLowerCase();

        // Extract categories and subcategories
        for (const [category, config] of Object.entries(
          this.productCategories
        )) {
          // Check main category terms
          config.terms.forEach((term) => {
            if (lowerText.includes(term)) {
              entities.categories.push(category);
            }
          });

          // Check subcategories
          for (const [subcat, terms] of Object.entries(config.subcategories)) {
            terms.forEach((term) => {
              if (lowerText.includes(term)) {
                entities.subcategories.push(subcat);
                entities.products.push(term);
                if (!entities.categories.includes(category)) {
                  entities.categories.push(category);
                }
              }
            });
          }
        }

        // Extract brands
        for (const [category, brands] of Object.entries(this.brands)) {
          brands.forEach((brand) => {
            if (lowerText.includes(brand.toLowerCase())) {
              entities.brands.push(brand);
            }
          });
        }

        // Extract colors
        this.colors.forEach((color) => {
          if (lowerText.includes(color)) {
            entities.colors.push(color);
          }
        });

        // Extract price ranges
        this.priceIndicators.forEach((pattern) => {
          const match = text.match(pattern);
          if (match) {
            entities.priceRange = {
              min: match[1] ? parseInt(match[1]) : null,
              max: match[2] ? parseInt(match[2]) : null,
              originalText: match[0],
            };
          }
        });

        return entities;
      },
    };
  }

  // Context analyzer for understanding conversation flow
  initializeContextAnalyzer() {
    return {
      analyzeContext: function (currentCommand, history, currentPage) {
        const context = {
          isFollowUp: false,
          previousIntent: null,
          pageContext: this.getPageContext(currentPage),
          suggestedActions: [],
          confidenceBoost: 1.0,
        };

        // Analyze previous commands
        if (history.length > 0) {
          const lastCommand = history[history.length - 1];
          context.previousIntent = lastCommand.intent;

          // Check for follow-up patterns
          const followUpPatterns = [
            /(?:and|also|too|as well)/i,
            /(?:show me more|what else|anything else)/i,
            /(?:similar|like that|the same)/i,
          ];

          context.isFollowUp = followUpPatterns.some((pattern) =>
            pattern.test(currentCommand)
          );
        }

        return context;
      },

      getPageContext: function (currentPage) {
        const pageMap = {
          "index.html": {
            type: "home",
            suggestions: ["search", "browse categories"],
          },
          "elecCat.html": { type: "category", category: "electronics" },
          "ApplianCat.html": { type: "category", category: "appliances" },
          "Fashion.html": { type: "category", category: "fashion" },
          "Beauty.html": { type: "category", category: "beauty" },
          "HomeCat.html": { type: "category", category: "home" },
          "videogamecat.html": { type: "category", category: "videogames" },
          "cart.html": {
            type: "cart",
            suggestions: ["checkout", "remove items"],
          },
          "search-results.html": {
            type: "search",
            suggestions: ["filter", "sort"],
          },
        };

        const fileName = currentPage.split("/").pop() || "index.html";
        return pageMap[fileName] || { type: "unknown" };
      },
    };
  }

  // Enhanced speech recognition with better confidence handling
  initializeEnhancedSpeechRecognition() {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.error("Speech recognition not supported");
      const statusText = document.querySelector(".status-text");
      if (statusText)
        statusText.textContent = "Voice search not supported in this browser";
      return null;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Enhanced configuration for better accuracy
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 5; // Increased for better options
    recognition.grammars = this.createCustomGrammar(); // Add custom grammar

    const voiceSearchBtn = document.getElementById("voiceSearchBtn");
    const voiceSidebar = document.getElementById("voiceSidebar");
    const transcriptContent = document.getElementById("transcriptContent");
    const statusText = document.querySelector(".status-text");

    recognition.onstart = () => {
      this.isListening = true;
      if (voiceSearchBtn) voiceSearchBtn.classList.add("listening");
      if (voiceSidebar) voiceSidebar.classList.add("listening");
      if (statusText)
        statusText.textContent =
          "🎤 Listening... Speak clearly about what you want to do.";
      this.startSilenceDetection();
    };

    recognition.onresult = (event) => {
      this.interimTranscript = "";
      this.finalTranscript = "";
      let bestAlternative = "";
      let highestConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          // Choose the alternative with highest confidence
          for (let j = 0; j < result.length; j++) {
            if (
              result[j].confidence > highestConfidence &&
              result[j].confidence > this.confidenceThreshold
            ) {
              highestConfidence = result[j].confidence;
              bestAlternative = result[j].transcript;
            }
          }
          this.finalTranscript += bestAlternative || result[0].transcript;
        } else {
          this.interimTranscript += result[0].transcript;
          this.markSpeechDetected();
        }
      }

      // Enhanced transcript display with confidence indicator
      if (transcriptContent) {
        const confidenceBar =
          highestConfidence > 0
            ? `<div class="confidence-bar" style="width: ${
                highestConfidence * 100
              }%; background: ${this.getConfidenceColor(
                highestConfidence
              )};"></div>`
            : "";

        const displayText =
          this.finalTranscript +
          (this.interimTranscript
            ? `<span style="color: #888; font-style: italic;">${this.interimTranscript}</span>`
            : "");

        transcriptContent.innerHTML = displayText || "Listening...";

        if (highestConfidence > 0) {
          if (statusText)
            statusText.textContent = `Confidence: ${Math.round(
              highestConfidence * 100
            )}% - ${this.getConfidenceMessage(highestConfidence)}`;
        }
      }

      if (this.interimTranscript) {
        this.markSpeechDetected();
      }
    };

    recognition.onend = () => {
      this.isListening = false;
      this.stopSilenceDetection();
      if (voiceSearchBtn) voiceSearchBtn.classList.remove("listening");
      if (voiceSidebar) voiceSidebar.classList.remove("listening");

      if (this.finalTranscript.trim()) {
        this.processIntelligentCommand(this.finalTranscript.trim());
      } else if (this.speechDetected) {
        if (statusText)
          statusText.textContent =
            "I didn't understand clearly. Please try again and speak more clearly.";
      } else {
        if (statusText)
          statusText.textContent =
            "No speech detected. Click start to try again.";
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      this.isListening = false;
      this.stopSilenceDetection();
      if (voiceSearchBtn) voiceSearchBtn.classList.remove("listening");
      if (voiceSidebar) voiceSidebar.classList.remove("listening");

      const errorMessages = {
        "no-speech": "No speech detected. Please speak louder and try again.",
        "audio-capture":
          "Microphone not found. Please check your microphone settings.",
        "not-allowed":
          "Microphone access denied. Please allow microphone access and try again.",
        network: "Network error. Please check your internet connection.",
        "service-not-allowed":
          "Speech service unavailable. Please try again later.",
        aborted: "Speech recognition was interrupted.",
        "language-not-supported":
          "Language not supported. Please ensure English is selected.",
      };

      if (statusText) {
        statusText.textContent =
          errorMessages[event.error] ||
          "Speech recognition error. Please try again.";
      }
    };

    return recognition;
  }

  // Create custom grammar for better recognition
  createCustomGrammar() {
    if ("webkitSpeechGrammarList" in window) {
      const grammarList = new webkitSpeechGrammarList();
      const grammar = `
        #JSGF V1.0; grammar commands;
        public <command> = <search> | <navigation> | <action>;
        <search> = (search for | find | look for | show me | get me) <product>;
        <navigation> = (go to | open | show me | take me to) <page>;
        <action> = (add to cart | buy | checkout | scroll up | scroll down | go back);
        <product> = (iPhone | Samsung | laptop | TV | shoes | makeup | perfume);
        <page> = (electronics | appliances | fashion | beauty | home | cart | profile);
      `;
      grammarList.addFromString(grammar, 1);
      return grammarList;
    }
    return null;
  }

  // Get confidence color for visual feedback
  getConfidenceColor(confidence) {
    if (confidence > 0.8) return "#28a745"; // Green
    if (confidence > 0.6) return "#ffc107"; // Yellow
    return "#dc3545"; // Red
  }

  // Get confidence message
  getConfidenceMessage(confidence) {
    if (confidence > 0.8) return "High confidence - Processing...";
    if (confidence > 0.6) return "Medium confidence - Analyzing...";
    return "Low confidence - Please speak more clearly";
  }

  // Enhanced command processing with specific keyword patterns
  async processIntelligentCommand(command) {
    const statusText = document.querySelector(".status-text");
    const lowerCommand = command.toLowerCase().trim();

    console.log("Processing voice command:", command);

    if (statusText) {
      statusText.textContent = `🧠 Processing: "${command}"`;
    }

    // 1. Handle "Go to [Category name]" pattern with more variations
    const goToPatterns = [
      /^(?:go\s+to|navigate\s+to|take\s+me\s+to|show\s+me)\s+(.+)$/i,
      /^(?:open|display)\s+(.+)$/i,
      /^(?:i\s+want\s+to\s+go\s+to|i\s+want\s+to\s+see)\s+(.+)$/i,
    ];

    for (const pattern of goToPatterns) {
      const match = command.match(pattern);
      if (match) {
        const destination = match[1].toLowerCase().trim();
        await this.handleGoToCommand(destination, statusText);
        return;
      }
    }

    // 2. Handle "Open [my profile/orders]" pattern with more variations
    const openPatterns = [
      /^(?:open|show\s+me)\s+(?:my\s+)?(.+)$/i,
      /^(?:take\s+me\s+to\s+my|go\s+to\s+my)\s+(.+)$/i,
      /^(?:i\s+want\s+to\s+see\s+my|display\s+my)\s+(.+)$/i,
    ];

    for (const pattern of openPatterns) {
      const match = command.match(pattern);
      if (match) {
        const target = match[1].toLowerCase().trim();
        // Check if it's a profile/account related command
        if (
          ["profile", "account", "orders", "cart", "dashboard"].includes(target)
        ) {
          await this.handleOpenCommand(target, statusText);
          return;
        }
      }
    }

    // 3. Handle "Search for/Find/I want [Product name]" patterns with more variations
    const searchPatterns = [
      /^(?:search\s+for|find|look\s+for|i\s+want|i\s+need)\s+(.+)$/i,
      /^(?:show\s+me|get\s+me|bring\s+me)\s+(.+)$/i,
      /^(?:type|enter|put)\s+(.+?)(?:\s+in\s+search)?$/i,
      /^(?:can\s+you\s+find|can\s+you\s+search\s+for)\s+(.+)$/i,
      /^(?:where\s+can\s+i\s+find|where\s+is)\s+(.+)$/i,
    ];

    for (const pattern of searchPatterns) {
      const match = command.match(pattern);
      if (match) {
        const searchTerm = match[1].trim();
        await this.handleSearchCommand(searchTerm, statusText);
        return;
      }
    }

    // 4. Handle scroll commands
    const scrollPatterns = [
      /^(?:scroll\s+)?(?:up|down)$/i,
      /^(?:go\s+)?(?:back|forward)$/i,
      /^(?:page\s+)?(?:up|down)$/i,
    ];

    for (const pattern of scrollPatterns) {
      if (pattern.test(lowerCommand)) {
        await this.handleScrollCommand(lowerCommand, statusText);
        return;
      }
    }

    // 6. Handle close sidebar commands
    const closeSidebarPatterns = [
      /^(?:close|exit|stop|cancel)$/i,
      /^(?:close\s+voice\s+search|stop\s+listening)$/i,
      /^(?:exit\s+voice\s+mode|cancel\s+voice)$/i,
    ];

    for (const pattern of closeSidebarPatterns) {
      if (pattern.test(lowerCommand)) {
        if (statusText) statusText.textContent = "❌ Closing voice search...";
        setTimeout(() => this.closeVoiceSidebar(), 500);
        return;
      }
    }

    // 7. Handle refresh/reload commands
    if (lowerCommand.includes("refresh") || lowerCommand.includes("reload")) {
      if (statusText) statusText.textContent = "🔄 Refreshing page...";
      setTimeout(() => window.location.reload(), 500);
      return;
    }

    // 8. Handle help commands
    const helpPatterns = [
      /^(?:help|what\s+can\s+i\s+say|commands|what\s+commands)$/i,
      /^(?:show\s+me\s+help|voice\s+help|how\s+to\s+use)$/i,
    ];

    for (const pattern of helpPatterns) {
      if (pattern.test(lowerCommand)) {
        if (statusText) {
          statusText.textContent =
            "ℹ️ Voice commands: 'Go to [category]', 'Search for [item]', 'Open [page]', 'Scroll up/down'";
        }
        return;
      }
    }

    // 9. Handle "show me" or "take me to" patterns for categories
    const showMePatterns = [
      /^(?:show\s+me|take\s+me\s+to|navigate\s+to)\s+(.+)$/i,
      /^(?:i\s+want\s+to\s+browse|browse)\s+(.+)$/i,
      /^(?:visit|check\s+out)\s+(.+)$/i,
    ];

    for (const pattern of showMePatterns) {
      const match = command.match(pattern);
      if (match) {
        const destination = match[1].toLowerCase().trim();
        await this.handleGoToCommand(destination, statusText);
        return;
      }
    }

    // 10. Handle product-specific navigation (if someone says a product name, take them to relevant category)
    const productCategoryMap = {
      iphone: "mobileandtablets.html",
      ipad: "mobileandtablets.html",
      samsung: "mobileandtablets.html",
      playstation: "console.html",
      ps5: "console.html",
      xbox: "console.html",
      "washing machine": "largeAppliances.html",
      refrigerator: "largeAppliances.html",
      fridge: "largeAppliances.html",
      sofa: "furniture.html",
      chair: "furniture.html",
      table: "furniture.html",
      perfume: "Fragrance.html",
      makeup: "makeup.html",
      shoes: "Fashion.html",
      laptop: "laptop.html",
      tv: "tvs.html",
      television: "tvs.html",
    };

    for (const [product, page] of Object.entries(productCategoryMap)) {
      if (lowerCommand.includes(product)) {
        if (statusText)
          statusText.textContent = `🚀 Going to ${product} section...`;
        setTimeout(() => (window.location.href = page), 500);
        return;
      }
    }

    // Fallback for unrecognized commands
    if (statusText) {
      statusText.textContent = `🤔 Command not recognized. Try: "Go to electronics", "Open my profile", or "Search for iPhone"`;
    }
  }

  // New method to handle scroll commands
  async handleScrollCommand(command, statusText) {
    if (command.includes("down")) {
      window.scrollBy(0, 400);
      if (statusText) statusText.textContent = "📜 Scrolling down...";
    } else if (command.includes("up")) {
      window.scrollBy(0, -400);
      if (statusText) statusText.textContent = "📜 Scrolling up...";
    } else if (command.includes("back")) {
      window.history.back();
      if (statusText) statusText.textContent = "🔙 Going back...";
    } else if (command.includes("forward")) {
      window.history.forward();
      if (statusText) statusText.textContent = "⏭️ Going forward...";
    }
  }

  // Handle "Go to [category]" commands
  async handleGoToCommand(destination, statusText) {
    const categoryMap = {
      // Main categories
      electronics: "elecCat.html",
      appliances: "ApplianCat.html",
      fashion: "Fashion.html",
      beauty: "Beauty.html",
      home: "HomeCat.html",
      "video games": "videogamecat.html",
      videogames: "videogamecat.html",
      games: "videogamecat.html",
      gaming: "videogamecat.html",
      cart: "cart.html",
      "shopping cart": "cart.html",
      basket: "cart.html",

      // Special pages
      homepage: "index.html",
      "home page": "index.html",
      "main page": "index.html",
      index: "index.html",
      login: "signinPage.html",
      signin: "signinPage.html",
      "sign in": "signinPage.html",
      signup: "signupPage.html",
      "sign up": "signupPage.html",
      register: "signupPage.html",
      profile: "profile.html",
      "my profile": "profile.html",
      "user profile": "profile.html",
      account: "profile.html",
      "my account": "profile.html",
      orders: "orders.html",
      "my orders": "orders.html",
      "order history": "orders.html",
      "purchase history": "orders.html",
      seller: "seller.html",
      "seller page": "seller.html",
      "become seller": "seller.html",
      "seller dashboard": "seller-dashboard.html",
      admin: "adminPage.html",
      "admin panel": "adminPage.html",
      "admin page": "adminPage.html",

      // Electronics subcategories
      mobile: "mobileandtablets.html",
      "mobile and tablets": "mobileandtablets.html",
      "mobile phones": "mobileandtablets.html",
      phones: "mobileandtablets.html",
      smartphones: "mobileandtablets.html",
      tablets: "mobileandtablets.html",
      ipad: "mobileandtablets.html",
      iphone: "mobileandtablets.html",
      tv: "tvs.html",
      tvs: "tvs.html",
      television: "tvs.html",
      televisions: "tvs.html",
      "smart tv": "tvs.html",
      "smart tvs": "tvs.html",
      laptop: "laptop.html",
      laptops: "laptop.html",
      computers: "laptop.html",
      "gaming laptop": "laptop.html",
      "gaming laptops": "laptop.html",
      notebook: "laptop.html",
      notebooks: "laptop.html",

      // Appliances subcategories
      "large appliances": "largeAppliances.html",
      "big appliances": "largeAppliances.html",
      "washing machines": "largeAppliances.html",
      "washing machine": "largeAppliances.html",
      refrigerator: "largeAppliances.html",
      refrigerators: "largeAppliances.html",
      fridge: "largeAppliances.html",
      fridges: "largeAppliances.html",
      dishwasher: "largeAppliances.html",
      dishwashers: "largeAppliances.html",
      "small appliances": "smallAppliances.html",
      "kitchen appliances": "smallAppliances.html",
      microwave: "smallAppliances.html",
      microwaves: "smallAppliances.html",
      toaster: "smallAppliances.html",
      toasters: "smallAppliances.html",
      blender: "smallAppliances.html",
      blenders: "smallAppliances.html",

      // Home subcategories
      furniture: "furniture.html",
      sofa: "furniture.html",
      sofas: "furniture.html",
      couch: "furniture.html",
      couches: "furniture.html",
      chair: "furniture.html",
      chairs: "furniture.html",
      table: "furniture.html",
      tables: "furniture.html",
      bed: "furniture.html",
      beds: "furniture.html",
      desk: "furniture.html",
      desks: "furniture.html",
      "home decor": "homeDecor.html",
      "home decoration": "homeDecor.html",
      decor: "homeDecor.html",
      decoration: "homeDecor.html",
      lamp: "homeDecor.html",
      lamps: "homeDecor.html",
      lighting: "homeDecor.html",
      lights: "homeDecor.html",
      mirror: "homeDecor.html",
      mirrors: "homeDecor.html",
      kitchen: "Kitchen&Dining.html",
      "kitchen and dining": "Kitchen&Dining.html",
      "kitchen dining": "Kitchen&Dining.html",
      dining: "Kitchen&Dining.html",
      cookware: "Kitchen&Dining.html",
      utensils: "Kitchen&Dining.html",
      plates: "Kitchen&Dining.html",
      cups: "Kitchen&Dining.html",
      bath: "bath&bedding.html",
      "bath and bedding": "bath&bedding.html",
      "bath bedding": "bath&bedding.html",
      bathroom: "bath&bedding.html",
      bedding: "bath&bedding.html",
      towels: "bath&bedding.html",
      towel: "bath&bedding.html",
      sheets: "bath&bedding.html",
      pillows: "bath&bedding.html",
      pillow: "bath&bedding.html",

      // Video Games subcategories
      console: "console.html",
      consoles: "console.html",
      "gaming console": "console.html",
      "gaming consoles": "console.html",
      "game console": "console.html",
      "game consoles": "console.html",
      playstation: "console.html",
      "play station": "console.html",
      ps5: "console.html",
      "ps 5": "console.html",
      xbox: "console.html",
      "x box": "console.html",
      nintendo: "console.html",
      switch: "console.html",
      controller: "controller.html",
      controllers: "controller.html",
      gamepad: "controller.html",
      gamepads: "controller.html",
      "game controller": "controller.html",
      "game controllers": "controller.html",
      accessories: "accessories.html",
      "gaming accessories": "accessories.html",
      "game accessories": "accessories.html",
      headset: "accessories.html",
      headsets: "accessories.html",
      "gaming headset": "accessories.html",
      "gaming headsets": "accessories.html",

      // Fashion subcategories
      women: "woman.html",
      "womens fashion": "woman.html",
      "women fashion": "woman.html",
      "women's fashion": "woman.html",
      "ladies fashion": "woman.html",
      "female fashion": "woman.html",
      men: "men.html",
      "mens fashion": "men.html",
      "men fashion": "men.html",
      "men's fashion": "men.html",
      "male fashion": "men.html",
      "gentlemen fashion": "men.html",
      kids: "kids.html",
      "kids fashion": "kids.html",
      "children fashion": "kids.html",
      "children's fashion": "kids.html",
      "baby fashion": "kids.html",
      children: "kids.html",
      child: "kids.html",

      // Additional fashion items
      shoes: "Fashion.html",
      shoe: "Fashion.html",
      footwear: "Fashion.html",
      sneakers: "Fashion.html",
      sneaker: "Fashion.html",
      boots: "Fashion.html",
      sandals: "Fashion.html",
      clothing: "Fashion.html",
      clothes: "Fashion.html",
      apparel: "Fashion.html",
      shirt: "Fashion.html",
      shirts: "Fashion.html",
      pants: "Fashion.html",
      jeans: "Fashion.html",
      dress: "Fashion.html",
      dresses: "Fashion.html",

      // Beauty subcategories
      makeup: "makeup.html",
      "make up": "makeup.html",
      cosmetics: "makeup.html",
      lipstick: "makeup.html",
      lipsticks: "makeup.html",
      foundation: "makeup.html",
      mascara: "makeup.html",
      eyeshadow: "makeup.html",
      skincare: "skincare.html",
      "skin care": "skincare.html",
      moisturizer: "skincare.html",
      moisturizers: "skincare.html",
      cleanser: "skincare.html",
      cleansers: "skincare.html",
      serum: "skincare.html",
      serums: "skincare.html",
      sunscreen: "skincare.html",
      haircare: "haircare.html",
      "hair care": "haircare.html",
      shampoo: "haircare.html",
      shampoos: "haircare.html",
      conditioner: "haircare.html",
      conditioners: "haircare.html",
      "hair color": "haircare.html",
      "hair dye": "haircare.html",
      fragrance: "Fragrance.html",
      fragrances: "Fragrance.html",
      perfume: "Fragrance.html",
      perfumes: "Fragrance.html",
      cologne: "Fragrance.html",
      colognes: "Fragrance.html",
      "eau de parfum": "Fragrance.html",
    };

    const targetPage = categoryMap[destination];

    if (targetPage) {
      if (statusText) statusText.textContent = `🚀 Going to ${destination}...`;

      setTimeout(() => {
        window.location.href = targetPage;
      }, 500);
    } else {
      if (statusText) {
        statusText.textContent = `❌ Category "${destination}" not found. Try: electronics, fashion, beauty, home, etc.`;
      }
    }
  }

  // Handle "Open [profile/orders]" commands
  async handleOpenCommand(target, statusText) {
    const pageMap = {
      "my profile": "profile.html",
      profile: "profile.html",
      "my account": "profile.html",
      account: "profile.html",
      "my orders": "orders.html",
      orders: "orders.html",
      "order history": "orders.html",
      cart: "cart.html",
      "my cart": "cart.html",
      "shopping cart": "cart.html",
    };

    const targetPage = pageMap[target];

    if (targetPage) {
      if (statusText) statusText.textContent = `🚀 Opening ${target}...`;

      setTimeout(() => {
        window.location.href = targetPage;
      }, 500);
    } else {
      if (statusText) {
        statusText.textContent = `❌ Page "${target}" not found. Try: "my profile", "orders", or "cart"`;
      }
    }
  }

  // Handle search commands with enhanced query processing
  async handleSearchCommand(searchTerm, statusText) {
    const searchInput = document.querySelector(".navsearch");

    // Process the search term with enhanced AI understanding
    const processedSearchTerm = this.processVoiceQuery(searchTerm);

    if (statusText)
      statusText.textContent = `⌨️ Typing "${processedSearchTerm}" in search bar...`;

    if (searchInput) {
      // Type the processed search term into the search bar
      await this.animateTyping(searchInput, processedSearchTerm, statusText);

      // Auto-submit the search after a brief delay
      setTimeout(() => {
        if (statusText)
          statusText.textContent = `🔍 Searching for: ${processedSearchTerm}`;
        window.location.href = `search-results.html?q=${encodeURIComponent(
          processedSearchTerm
        )}`;
      }, 800);
    } else {
      // Direct navigation if search input not found
      if (statusText)
        statusText.textContent = `🔍 Searching for: ${processedSearchTerm}`;
      setTimeout(() => {
        window.location.href = `search-results.html?q=${encodeURIComponent(
          processedSearchTerm
        )}`;
      }, 500);
    }
  }

  // Enhanced query processing function for voice search
  processVoiceQuery(query) {
    let processed = query.toLowerCase().trim();

    // Enhanced natural language processing for "I want/need" patterns
    const intentPatterns = [
      // Direct intent patterns
      {
        pattern:
          /^(i want|i need|i'm looking for|looking for|find me|show me|get me|i would like|gimme|give me)\s+(.+)$/i,
        extract: 2,
      },
      { pattern: /^(search for|find)\s+(.+)$/i, extract: 2 },
      { pattern: /^(do you have|any)\s+(.+)$/i, extract: 2 },
      { pattern: /^(where (?:can i find|is)|where are)\s+(.+)$/i, extract: 2 },
      { pattern: /^(can you show me|show me)\s+(.+)$/i, extract: 2 },

      // Purchase intent patterns
      {
        pattern: /^(i want to buy|want to buy|buy me|purchase)\s+(.+)$/i,
        extract: 2,
      },
      { pattern: /^(i'm interested in|interested in)\s+(.+)$/i, extract: 2 },

      // Question patterns
      { pattern: /^(what about|how about)\s+(.+)$/i, extract: 2 },
      { pattern: /^(do you sell|do you have)\s+(.+)$/i, extract: 2 },

      // Article patterns
      { pattern: /^(a|an|the|some)\s+(.+)$/i, extract: 2 },
    ];

    // Check for intent patterns first
    for (const { pattern, extract } of intentPatterns) {
      const match = processed.match(pattern);
      if (match && match[extract]) {
        processed = match[extract].trim();
        break;
      }
    }

    // Remove remaining common filler words that might be left
    const fillerWords = [
      "please",
      "kindly",
      "maybe",
      "perhaps",
      "possibly",
      "actually",
      "really",
      "definitely",
      "surely",
      "good",
      "best",
      "nice",
      "great",
      "awesome",
      "cheap",
      "expensive",
      "affordable",
      "budget",
      "for me",
      "for my",
      "that is",
      "which is",
      "something",
      "anything",
      "everything",
    ];

    fillerWords.forEach((filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, "gi");
      processed = processed.replace(regex, "");
    });

    processed = processed.replace(/\s+/g, " ").trim();

    // Advanced typo corrections and common mistakes
    const typoCorrections = {
      // Common typos
      iphone: "iPhone",
      ifone: "iPhone",
      "i phone": "iPhone",
      ipad: "iPad",
      "i pad": "iPad",
      samsng: "Samsung",
      samsung: "Samsung",
      samung: "Samsung",
      labtop: "laptop",
      laptop: "laptop",
      computer: "laptop",
      computr: "laptop",
      moblie: "mobile phone",
      mobile: "mobile phone",
      phone: "mobile phone",
      fone: "mobile phone",
      "cel phone": "mobile phone",
      cellphone: "mobile phone",

      // Appliances typos
      "washing machine": "washing machine",
      "washng machine": "washing machine",
      washer: "washing machine",
      "automatic washing machine": "washing machine",
      "washing machne": "washing machine",
      dishwasher: "dishwasher",
      "dish washer": "dishwasher",
      "dish washing machine": "dishwasher",
      fridge: "refrigerator",
      refridgerator: "refrigerator",
      refrigrator: "refrigerator",
      frezer: "freezer",
      freezr: "freezer",
      tv: "television",
      televison: "television",
      "smart tv": "Smart TV",
      "smat tv": "Smart TV",

      // Gaming typos
      playstation: "PlayStation",
      "play station": "PlayStation",
      plastation: "PlayStation",
      ps5: "PlayStation 5",
      "ps 5": "PlayStation 5",
      playstation5: "PlayStation 5",
      xbox: "Xbox",
      "x box": "Xbox",
      "gaming console": "console",
      "game console": "console",
      consol: "console",

      // Beauty typos
      perfume: "perfume",
      perfum: "perfume",
      parfume: "perfume",
      fragrance: "perfume",
      fragrnce: "perfume",
      makeup: "makeup",
      "make up": "makeup",
      cosmetics: "makeup",
      cosmetcs: "makeup",
      lipstick: "lipstick",
      lipstik: "lipstick",
      mascara: "mascara",
      maskara: "mascara",

      // Fashion typos
      shoes: "shoes",
      shose: "shoes",
      shoe: "shoes",
      sneakers: "sneakers",
      sneaker: "sneakers",
      sneker: "sneakers",
      jeans: "jeans",
      jean: "jeans",
      shirt: "shirt",
      shrt: "shirt",

      // Home typos
      sofa: "sofa",
      couch: "sofa",
      chair: "chair",
      chiar: "chair",
      table: "table",
      tabel: "table",
      lamp: "lamp",
      lmap: "lamp",
      lighting: "lamp",
      light: "lamp",
    };

    // Apply typo corrections
    Object.keys(typoCorrections).forEach((typo) => {
      const regex = new RegExp(`\\b${typo}\\b`, "gi");
      processed = processed.replace(regex, typoCorrections[typo]);
    });

    // Advanced semantic mapping for non-products to closest products
    const semanticMappings = {
      // Activity to product mappings
      cooking: "kitchen appliances cookware",
      gaming: "PlayStation console Xbox",
      entertainment: "television speakers headphones",
      music: "speakers headphones audio",
      photography: "camera accessories",
      fitness: "fitness equipment sports",
      reading: "lamp lighting books",
      sleeping: "bed bedding pillows mattress",
      cleaning: "vacuum cleaner cleaning supplies dishwasher",
      washing: "washing machine laundry dishwasher",
      storage: "furniture storage cabinet",
      studying: "desk chair laptop books",
      relaxing: "sofa chair comfort",
      working: "desk chair laptop office",

      // Location to product mappings
      kitchen: "kitchen appliances cookware refrigerator microwave dishwasher",
      bedroom: "bed furniture bedding mattress pillows",
      "living room": "sofa television furniture coffee table",
      bathroom: "bath towels shower accessories",
      office: "desk chair laptop computer office supplies",
      garage: "tools storage organization",
      garden: "outdoor furniture gardening tools",
      "dining room": "dining table chairs dinnerware dishwasher",

      // Occasion to product mappings
      birthday: "gifts electronics jewelry perfume",
      wedding: "home decor furniture gifts",
      christmas: "electronics gifts decorations",
      valentine: "jewelry perfume gifts romantic",
      party: "speakers electronics party supplies",
      work: "laptop office chair business",
      school: "laptop backpack student supplies",
      travel: "luggage electronics portable",
      anniversary: "jewelry perfume gifts romantic",

      // Generic categories to specific products
      technology: "electronics laptop smartphone tablet",
      gadgets: "electronics smartphone accessories tech",
      appliances: "washing machine refrigerator microwave dishwasher",
      furniture: "sofa chair table bed",
      beauty: "makeup skincare perfume cosmetics",
      fashion: "shoes clothing accessories",
      home: "furniture home decor appliances",
      electronics: "smartphone laptop television",
      accessories: "jewelry bags belts watches",

      // Abstract concepts to products
      comfort: "sofa bed pillows mattress",
      convenience: "appliances electronics smart home dishwasher",
      style: "fashion clothing shoes accessories",
      luxury: "perfume jewelry watches premium",
      efficiency: "appliances electronics productivity dishwasher",
      performance: "gaming laptop electronics sports",
      organization: "storage furniture organizers",
      decoration: "home decor furniture lighting",
      safety: "security electronics safety equipment",
      health: "fitness equipment health products",
    };

    // Check for semantic mappings if no direct product match
    let semanticMatch = "";
    Object.keys(semanticMappings).forEach((concept) => {
      if (processed.includes(concept)) {
        semanticMatch = semanticMappings[concept];
      }
    });

    if (semanticMatch) {
      processed = semanticMatch;
    }

    // Handle common patterns and phrases
    const patternMappings = [
      {
        pattern: /(?:automatic|auto).+wash/i,
        replacement: "washing machine",
      },
      {
        pattern: /(?:smart|led|4k).+tv/i,
        replacement: "smart television",
      },
      {
        pattern: /(?:gaming|game).+(?:laptop|computer)/i,
        replacement: "gaming laptop",
      },
      {
        pattern: /(?:wireless|bluetooth).+(?:headphone|earphone)/i,
        replacement: "wireless headphones",
      },
      {
        pattern: /(?:hair|shampoo|conditioner)/i,
        replacement: "haircare",
      },
      {
        pattern: /(?:skin|face|cream|moisturizer)/i,
        replacement: "skincare",
      },
      {
        pattern: /(?:running|sport|athletic).+shoe/i,
        replacement: "athletic shoes",
      },
      {
        pattern: /(?:dish|dishes).+(?:wash|clean)/i,
        replacement: "dishwasher",
      },
    ];

    patternMappings.forEach(({ pattern, replacement }) => {
      if (pattern.test(processed)) {
        processed = replacement;
      }
    });

    return processed || query;
  }

  // Enhanced recommendation with current context
  async handleRecommendationIntent(command, entities) {
    let category = "";
    const statusText = document.querySelector(".status-text");

    if (entities.categories.length > 0) {
      category = entities.categories[0];
    } else {
      // Try to infer from current page
      const currentPath = window.location.pathname;
      if (currentPath.includes("elec")) category = "electronics";
      else if (currentPath.includes("fashion")) category = "fashion";
      else if (currentPath.includes("beauty")) category = "beauty";
      else if (currentPath.includes("home")) category = "home";
    }

    if (statusText)
      statusText.textContent = `Looking for recommendations${
        category ? ` in ${category}` : ""
      }...`;

    if (category === "electronics") {
      setTimeout(() => (window.location.href = "elecCat.html"), 1000);
    } else if (category === "fashion") {
      setTimeout(() => (window.location.href = "Fashion.html"), 1000);
    } else if (category === "beauty") {
      setTimeout(() => (window.location.href = "Beauty.html"), 1000);
    } else {
      await this.performIntelligentSearch("bestseller trending popular");
    }
  }

  // Improved fallback with context suggestions
  async handleFallbackIntent(command, entities) {
    const statusText = document.querySelector(".status-text");

    if (entities.pages.length > 0 || entities.navigation_targets.length > 0) {
      await this.handleNavigationIntent(command, entities);
    } else if (entities.categories.length > 0) {
      await this.handleSearchIntent(command, entities);
    } else if (entities.actions.length > 0) {
      await this.handleActionIntent(command, entities);
    } else {
      // Check if it might be a search query without explicit search command
      const searchWords = [
        "iphone",
        "samsung",
        "laptop",
        "tv",
        "phone",
        "shoes",
        "makeup",
        "perfume",
      ];
      const hasSearchTerms = searchWords.some((word) =>
        command.toLowerCase().includes(word)
      );

      if (hasSearchTerms) {
        await this.handleSearchIntent(command, entities);
      } else {
        if (statusText) {
          const suggestions = [
            "Try: 'search for iPhone'",
            "'go to electronics'",
            "'show me bestsellers'",
            "'scroll down'",
            "'go to cart'",
          ];

          statusText.textContent = `I didn't understand. ${
            suggestions[Math.floor(Math.random() * suggestions.length)]
          }`;
        }
      }
    }
  }

  // Enhanced navigation intent with context awareness
  async handleAdvancedNavigationIntent(command, entities, context) {
    const statusText = document.querySelector(".status-text");

    // Enhanced profile detection first
    const profilePatterns = [
      /(?:go\s+to|open|show\s+me|take\s+me\s+to)\s+(?:my\s+)?profile/i,
      /(?:go\s+to|open|show\s+me|take\s+me\s+to)\s+(?:my\s+)?account/i,
      /(?:go\s+to|open|show\s+me|take\s+me\s+to)\s+(?:user\s+)?profile/i,
      /profile/i,
      /my\s+account/i,
      /user\s+profile/i,
      /personal\s+profile/i,
    ];

    const lowerCommand = command.toLowerCase();
    console.log("Navigation command:", lowerCommand); // Debug log

    // Check profile patterns first
    const isProfileCommand = profilePatterns.some((pattern) =>
      pattern.test(lowerCommand)
    );
    if (isProfileCommand) {
      if (statusText) statusText.textContent = "🚀 Navigating to profile...";
      this.contextualMemory.lastCategory = "profile.html";

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 500);
      return;
    }

    // Complete navigation mapping including all category pages
    const navigationMap = {
      electronics: {
        url: "elecCat.html",
        keywords: ["electronics", "electronic", "tech", "technology"],
      },
      appliances: {
        url: "ApplianCat.html",
        keywords: ["appliances", "appliance", "home appliances"],
      },
      fashion: {
        url: "Fashion.html",
        keywords: ["fashion", "clothes", "clothing", "wear"],
      },
      beauty: {
        url: "Beauty.html",
        keywords: ["beauty", "makeup", "cosmetics", "fragrance", "skincare"],
      },
      home: {
        url: "HomeCat.html",
        keywords: ["home", "furniture", "decor", "decoration"],
      },
      videogames: {
        url: "videogamecat.html",
        keywords: ["video games", "games", "gaming", "console"],
      },
      cart: { url: "cart.html", keywords: ["cart", "basket", "shopping cart"] },
      profile: {
        url: "profile.html",
        keywords: [
          "profile",
          "account",
          "my account",
          "my profile",
          "user profile",
          "personal profile",
        ],
      },
      orders: {
        url: "orders.html",
        keywords: ["orders", "my orders", "purchase history", "order history"],
      },
      seller: {
        url: "seller.html",
        keywords: ["seller", "seller page", "become seller"],
      },
      "seller dashboard": {
        url: "seller-dashboard.html",
        keywords: ["seller dashboard", "dashboard"],
      },
      admin: {
        url: "adminPage.html",
        keywords: ["admin", "admin panel", "admin page"],
      },
      login: {
        url: "signinPage.html",
        keywords: ["login", "signin", "sign in"],
      },
      signup: {
        url: "signupPage.html",
        keywords: ["signup", "sign up", "register"],
      },

      // Electronics subcategories
      mobile: {
        url: "mobileandtablets.html",
        keywords: [
          "mobile",
          "phone",
          "smartphone",
          "tablet",
          "mobile phones",
          "mobile and tablets",
          "iphone",
          "ipad",
        ],
      },
      tv: {
        url: "tvs.html",
        keywords: [
          "tv",
          "television",
          "smart tv",
          "tvs",
          "televisions",
          "smart tvs",
        ],
      },
      laptop: {
        url: "laptop.html",
        keywords: [
          "laptop",
          "computer",
          "notebook",
          "laptops",
          "computers",
          "gaming laptop",
          "gaming laptops",
          "notebooks",
        ],
      },

      // Appliances subcategories
      large_appliances: {
        url: "largeAppliances.html",
        keywords: [
          "large appliances",
          "big appliances",
          "washing machine",
          "washing machines",
          "refrigerator",
          "refrigerators",
          "fridge",
          "fridges",
          "dishwasher",
          "dishwashers",
        ],
      },
      small_appliances: {
        url: "smallAppliances.html",
        keywords: [
          "small appliances",
          "kitchen appliances",
          "microwave",
          "microwaves",
          "toaster",
          "toasters",
          "blender",
          "blenders",
        ],
      },

      // Home subcategories
      furniture: {
        url: "furniture.html",
        keywords: [
          "furniture",
          "sofa",
          "chair",
          "table",
          "bed",
          "desk",
          "sofas",
          "chairs",
          "tables",
          "beds",
          "desks",
          "couch",
          "couches",
        ],
      },
      home_decor: {
        url: "homeDecor.html",
        keywords: [
          "home decor",
          "home decoration",
          "decor",
          "decoration",
          "lamp",
          "lamps",
          "lighting",
          "lights",
          "mirror",
          "mirrors",
        ],
      },
      kitchen_dining: {
        url: "Kitchen&Dining.html",
        keywords: [
          "kitchen",
          "dining",
          "kitchen and dining",
          "kitchen dining",
          "cookware",
          "utensils",
          "plates",
          "cups",
        ],
      },
      bath_bedding: {
        url: "bath&bedding.html",
        keywords: [
          "bath",
          "bedding",
          "bath and bedding",
          "bath bedding",
          "bathroom",
          "towels",
          "towel",
          "sheets",
          "pillows",
          "pillow",
        ],
      },

      // Video Games subcategories
      console: {
        url: "console.html",
        keywords: [
          "console",
          "consoles",
          "gaming console",
          "gaming consoles",
          "game console",
          "game consoles",
          "playstation",
          "play station",
          "ps5",
          "ps 5",
          "xbox",
          "x box",
          "nintendo",
          "switch",
        ],
      },
      controller: {
        url: "controller.html",
        keywords: [
          "controller",
          "controllers",
          "gamepad",
          "gamepads",
          "game controller",
          "game controllers",
        ],
      },
      gaming_accessories: {
        url: "accessories.html",
        keywords: [
          "accessories",
          "gaming accessories",
          "game accessories",
          "headset",
          "headsets",
          "gaming headset",
          "gaming headsets",
        ],
      },

      // Fashion subcategories
      women: {
        url: "woman.html",
        keywords: [
          "women",
          "women's fashion",
          "womens fashion",
          "women fashion",
          "ladies fashion",
          "female fashion",
        ],
      },
      men: {
        url: "men.html",
        keywords: [
          "men",
          "men's fashion",
          "mens fashion",
          "men fashion",
          "male fashion",
          "gentlemen fashion",
        ],
      },
      kids: {
        url: "kids.html",
        keywords: [
          "kids",
          "children",
          "child",
          "kids fashion",
          "children fashion",
          "children's fashion",
          "baby fashion",
        ],
      },

      // Beauty subcategories
      makeup: {
        url: "makeup.html",
        keywords: [
          "makeup",
          "make up",
          "cosmetics",
          "lipstick",
          "lipsticks",
          "foundation",
          "mascara",
          "eyeshadow",
        ],
      },
      skincare: {
        url: "skincare.html",
        keywords: [
          "skincare",
          "skin care",
          "moisturizer",
          "moisturizers",
          "cleanser",
          "cleansers",
          "serum",
          "serums",
          "sunscreen",
        ],
      },
      haircare: {
        url: "haircare.html",
        keywords: [
          "haircare",
          "hair care",
          "shampoo",
          "shampoos",
          "conditioner",
          "conditioners",
          "hair color",
          "hair dye",
        ],
      },
      fragrance: {
        url: "Fragrance.html",
        keywords: [
          "fragrance",
          "fragrances",
          "perfume",
          "perfumes",
          "cologne",
          "colognes",
          "eau de parfum",
        ],
      },
    };

    let targetPage = null;

    // AI-powered page detection
    for (const [page, config] of Object.entries(navigationMap)) {
      const matchFound = config.keywords.some((keyword) =>
        lowerCommand.includes(keyword)
      );
      if (matchFound) {
        targetPage = config.url;
        console.log("Found match:", page, "->", targetPage); // Debug log
        break;
      }
    }

    // Enhanced category detection using entities
    if (!targetPage && entities.categories.length > 0) {
      const category = entities.categories[0];
      if (navigationMap[category]) {
        targetPage = navigationMap[category].url;
      }
    }

    if (targetPage) {
      if (statusText)
        statusText.textContent = `🚀 Navigating to ${targetPage}...`;
      this.contextualMemory.lastCategory = targetPage;

      setTimeout(() => {
        window.location.href = targetPage;
      }, 500);
    } else {
      if (statusText) {
        statusText.textContent =
          "🤔 I couldn't find that page. Try saying 'go to electronics', 'go to my profile', or 'open cart'.";
      }
    }
  }

  // Enhanced action handling
  async handleActionIntent(command, entities) {
    const statusText = document.querySelector(".status-text");

    if (entities.actions.includes("scroll")) {
      if (command.toLowerCase().includes("down")) {
        window.scrollBy(0, 300);
        if (statusText) statusText.textContent = "Scrolling down...";
      } else if (command.toLowerCase().includes("up")) {
        window.scrollBy(0, -300);
        if (statusText) statusText.textContent = "Scrolling up...";
      }
    } else if (entities.actions.includes("back")) {
      window.history.back();
      if (statusText) statusText.textContent = "Going back...";
    } else if (entities.actions.includes("forward")) {
      window.history.forward();
      if (statusText) statusText.textContent = "Going forward...";
    } else if (entities.actions.includes("close")) {
      this.closeSidebar();
      if (statusText) statusText.textContent = "Closing voice search...";
    } else if (entities.actions.includes("checkout")) {
      window.location.href = "cart.html";
      if (statusText) statusText.textContent = "Going to checkout...";
    } else {
      if (statusText)
        statusText.textContent =
          "Action not recognized. Try 'scroll down', 'go back', or 'checkout'.";
    }
  }

  // Filter handling
  async handleFilterIntent(command, entities) {
    const statusText = document.querySelector(".status-text");

    if (entities.price_range) {
      if (statusText)
        statusText.textContent = `Filtering by price: ${entities.price_range}`;
      // Implement price filtering logic here
    } else {
      if (statusText)
        statusText.textContent = "Filter options: price, rating, brand, color";
    }
  }

  // Intelligent fallback with suggestions
  async handleIntelligentFallback(command, entities, context, intentResults) {
    const statusText = document.querySelector(".status-text");

    // Try to understand based on entities even if intent is unclear
    if (entities.products.length > 0 || entities.categories.length > 0) {
      await this.handleAdvancedSearchIntent(command, entities, context);
      return;
    }

    // Context-based suggestions
    let suggestions = [];

    if (context.pageContext.type === "home") {
      suggestions = [
        "Try 'search for iPhone'",
        "Say 'go to electronics'",
        "Ask 'show me bestsellers'",
      ];
    } else if (context.pageContext.type === "category") {
      suggestions = [
        `Try 'search in ${context.pageContext.category}'`,
        "Say 'go back'",
        "Ask 'show me cheap products'",
      ];
    } else if (context.pageContext.type === "search") {
      suggestions = [
        "Try 'filter by price'",
        "Say 'sort by rating'",
        "Ask 'show me similar products'",
      ];
    }

    if (statusText) {
      const suggestionText =
        suggestions.length > 0
          ? ` Here are some suggestions: ${suggestions.join(", ")}`
          : "";

      statusText.textContent = `🤔 I didn't understand "${command}".${suggestionText}`;
    }
  }

  // Enhanced performance for intelligent search
  async performIntelligentSearch(query) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/products/search-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            context: this.contextualMemory,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.products && result.products.length > 0) {
          // Store successful search in memory
          this.contextualMemory.lastSearchQuery = query;
          this.contextualMemory.userPreferences.push(query);

          // Navigate to search results
          window.location.href = `search-results.html?q=${encodeURIComponent(
            query
          )}`;
        } else {
          const statusText = document.querySelector(".status-text");
          if (statusText) {
            statusText.textContent = `🔍 No products found for "${query}". Try different keywords.`;
          }
        }
      }
    } catch (error) {
      console.error("Intelligent search error:", error);
      // Fallback to regular search
      window.location.href = `search-results.html?q=${encodeURIComponent(
        query
      )}`;
    }
  }

  // Enhanced silence detection with adaptive timing
  startSilenceDetection() {
    this.speechDetected = false;
    this.lastSpeechTime = Date.now();

    this.silenceTimer = setInterval(() => {
      const now = Date.now();
      const silenceDuration = now - this.lastSpeechTime;

      // Adaptive silence threshold based on speech detection
      const adaptiveThreshold = this.speechDetected
        ? this.silenceThreshold
        : this.silenceThreshold * 1.5;

      if (silenceDuration > adaptiveThreshold && this.isListening) {
        this.stopListening();
      }
    }, 100);
  }

  stopSilenceDetection() {
    if (this.silenceTimer) {
      clearInterval(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  markSpeechDetected() {
    this.speechDetected = true;
    this.lastSpeechTime = Date.now();
  }

  // Enhanced query cleaning with AI patterns
  cleanSearchQuery(query) {
    let cleaned = query.toLowerCase().trim();

    // Advanced filler word removal with context awareness
    const advancedFillers = [
      /\b(?:i\s+)?(?:want|need|am\s+looking\s+for|would\s+like)\s+/gi,
      /\b(?:search|find|look|show|get|bring|display)\s+(?:for|me)?\s+/gi,
      /\b(?:can\s+you\s+)?(?:please\s+)?/gi,
      /\b(?:type|enter|put|write)\s+/gi,
      /\b(?:in\s+the\s+)?search\s+(?:bar|box)?\s*$/gi,
      /^(?:ok|okay|alright|well)\s+/gi,
    ];

    advancedFillers.forEach((pattern) => {
      cleaned = cleaned.replace(pattern, " ");
    });

    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    // Context enhancement
    if (
      this.contextualMemory.lastCategory &&
      !cleaned.includes(this.contextualMemory.lastCategory)
    ) {
      // Could add category context if search is too generic
    }

    return cleaned || query;
  }

  // AI-powered search term extraction
  extractSearchTermsWithAI(command) {
    const cleanedCommand = this.cleanSearchQuery(command);

    // AI-like term importance scoring
    const words = cleanedCommand.split(" ").filter((word) => word.length > 2);
    const importantWords = words.filter((word) => {
      return ![
        "the",
        "and",
        "for",
        "with",
        "that",
        "this",
        "from",
        "they",
        "have",
        "been",
        "said",
        "each",
        "which",
        "their",
      ].includes(word.toLowerCase());
    });

    return importantWords.slice(0, 3).join(" "); // Take top 3 important words
  }

  // Enhanced typing animation
  async animateTyping(input, text, statusText) {
    input.value = "";
    input.focus();

    if (statusText)
      statusText.textContent = `⌨️ Typing "${text}" in search bar...`;

    for (let i = 0; i <= text.length; i++) {
      input.value = text.substring(0, i);

      // Trigger input event for live search suggestions
      const inputEvent = new Event("input", { bubbles: true });
      input.dispatchEvent(inputEvent);

      // Variable typing speed for more human-like effect
      const delay = Math.random() * 50 + 30; // 30-80ms delay
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Initialize the enhanced voice search
  init() {
    console.log("Initializing Enhanced AI Voice Search...");

    this.recognition = this.initializeEnhancedSpeechRecognition();

    if (!this.recognition) {
      console.error("Enhanced voice search could not be initialized");
      return;
    }

    // Setup UI event listeners
    this.setupEnhancedUIListeners();

    console.log("Enhanced AI Voice Search initialized successfully");
  }

  setupEnhancedUIListeners() {
    const voiceSearchBtn = document.getElementById("voiceSearchBtn");
    const voiceOverlay = document.getElementById("voiceOverlay");
    const voiceSidebar = document.getElementById("voiceSidebar");
    const closeSidebar = document.getElementById("closeSidebar");
    const startListening = document.getElementById("startListening");
    const stopListening = document.getElementById("stopListening");

    if (voiceSearchBtn) {
      voiceSearchBtn.addEventListener("click", () => {
        this.openVoiceSidebar();
      });
    }

    if (voiceOverlay) {
      voiceOverlay.addEventListener("click", () => {
        this.closeVoiceSidebar();
      });
    }

    if (closeSidebar) {
      closeSidebar.addEventListener("click", () => {
        this.closeVoiceSidebar();
      });
    }

    if (startListening) {
      startListening.addEventListener("click", () => {
        this.startListening();
      });
    }

    if (stopListening) {
      stopListening.addEventListener("click", () => {
        this.stopListening();
      });
    }

    // Enhanced keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + Shift + V to toggle voice search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "V") {
        e.preventDefault();
        this.toggleVoiceSearch();
      }

      // Escape to close voice search
      if (
        e.key === "Escape" &&
        voiceSidebar &&
        voiceSidebar.classList.contains("open")
      ) {
        this.closeVoiceSidebar();
      }
    });
  }

  openVoiceSidebar() {
    const voiceOverlay = document.getElementById("voiceOverlay");
    const voiceSidebar = document.getElementById("voiceSidebar");

    if (voiceOverlay) voiceOverlay.classList.add("active");
    if (voiceSidebar) voiceSidebar.classList.add("open");

    // Update context memory
    this.contextualMemory.currentPage = window.location.pathname;
  }

  closeVoiceSidebar() {
    const voiceOverlay = document.getElementById("voiceOverlay");
    const voiceSidebar = document.getElementById("voiceSidebar");

    if (voiceOverlay) voiceOverlay.classList.remove("active");
    if (voiceSidebar) voiceSidebar.classList.remove("open");

    if (this.isListening) {
      this.stopListening();
    }
  }

  toggleVoiceSearch() {
    const voiceSidebar = document.getElementById("voiceSidebar");
    if (voiceSidebar && voiceSidebar.classList.contains("open")) {
      this.closeVoiceSidebar();
    } else {
      this.openVoiceSidebar();
    }
  }

  startListening() {
    if (!this.recognition) {
      console.error("Speech recognition not available");
      return;
    }

    if (this.isListening) {
      console.log("Already listening");
      return;
    }

    // Reset transcript
    this.finalTranscript = "";
    this.interimTranscript = "";

    const transcriptContent = document.getElementById("transcriptContent");
    if (transcriptContent) {
      transcriptContent.textContent = "Listening...";
    }

    try {
      this.recognition.start();
      console.log("Enhanced voice recognition started");
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      const statusText = document.querySelector(".status-text");
      if (statusText) {
        statusText.textContent =
          "❌ Error starting voice recognition. Please try again.";
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      console.log("Enhanced voice recognition stopped");
    }
  }

  // Handle low confidence commands with better suggestions
  async handleLowConfidenceCommand(command, entities, context, intentResults) {
    const statusText = document.querySelector(".status-text");

    // First try to match common product terms even with low confidence
    const commonTerms = [
      "iphone",
      "samsung",
      "laptop",
      "tv",
      "phone",
      "shoes",
      "makeup",
      "perfume",
    ];
    const hasCommonTerm = commonTerms.some((term) =>
      command.toLowerCase().includes(term)
    );

    if (hasCommonTerm) {
      // Treat as search intent
      await this.handleAdvancedSearchIntent(command, entities, context);
      return;
    }

    if (statusText) {
      let suggestions = [];

      if (intentResults.length > 0) {
        suggestions = intentResults
          .slice(0, 3)
          .map(
            (result) =>
              `"${result.intent}" (${Math.round(result.confidence * 100)}%)`
          );
      }

      const suggestionText =
        suggestions.length > 0
          ? ` Did you mean: ${suggestions.join(", ")}?`
          : " Try being more specific.";

      statusText.textContent = `🤔 I'm not sure what you meant.${suggestionText}`;
    }
  }
}

// Initialize enhanced voice search when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing Enhanced AI Voice Search System...");
  window.enhancedVoiceSearch = new EnhancedVoiceSearch();
});

console.log("Enhanced AI Voice Search module loaded successfully");
