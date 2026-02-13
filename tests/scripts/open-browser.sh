#!/bin/bash

# Open Stop & Shop with Browser Configuration Instructions
# This script opens Chrome and displays setup instructions

OPCO="${TEST_OPCO:-stopandshop}"
ENV="${TEST_ENV:-delta}"
URL="https://nonprd-${ENV}.${OPCO}.com/"
USER_AGENT="qa-reg-(pdl)-cua/05:01; +reg/18"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Opening Browser with Configuration Guide          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 URL: $URL"
echo ""
echo "📋 SETUP INSTRUCTIONS:"
echo ""
echo "1️⃣  Open DevTools:"
echo "    • Press F12 (or Cmd+Option+I on Mac)"
echo ""
echo "2️⃣  Open Network Conditions:"
echo "    • Press Cmd+Shift+P (or Ctrl+Shift+P on Windows)"
echo "    • Type: 'Show Network conditions'"
echo "    • Press Enter"
echo ""
echo "3️⃣  Set User Agent:"
echo "    • Uncheck 'Use browser default'"
echo "    • Select 'Custom...'"
echo "    • Paste this value:"
echo ""
echo "    $USER_AGENT"
echo ""
echo "4️⃣  Reload the page (Cmd+R or Ctrl+R)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 TIP: Keep DevTools open to maintain the user agent"
echo ""
echo "Opening browser in 3 seconds..."
echo ""

sleep 3

# Try to open in default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$URL" 2>/dev/null || sensible-browser "$URL" 2>/dev/null || x-www-browser "$URL" 2>/dev/null
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start "$URL"
fi

echo "✅ Browser opened!"
echo ""
echo "📄 Full setup guide: tests/config/BROWSER_SETUP.md"
echo ""
