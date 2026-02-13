# How to Open Stop & Shop with QA User Agent in Chrome

## Quick Setup Guide

### Method 1: Chrome DevTools Network Conditions (Recommended)

1. **Open Chrome Browser**
   ```
   https://nonprd-delta.stopandshop.com/
   ```

2. **Open DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)

3. **Open Network Conditions**
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
   - Type: "Show Network conditions"
   - Press Enter

4. **Set Custom User Agent**
   - In Network conditions panel, under "User agent"
   - ☐ Uncheck "Use browser default"
   - Select "Custom..." from dropdown
   - Paste this value:
     ```
     qa-reg-(pdl)-cua/05:01; +reg/18
     ```

5. **Reload the Page**
   - Press `Cmd+R` (Mac) or `Ctrl+R` (Windows)
   - The page should now load without security block

6. **Verify (Optional)**
   - In DevTools Console, type:
     ```javascript
     navigator.userAgent
     ```
   - Should show: `qa-reg-(pdl)-cua/05:01; +reg/18`

---

## Current Configuration

- **OPCO:** Stop & Shop
- **Environment:** Delta
- **URL:** https://nonprd-delta.stopandshop.com/
- **User Agent:** `qa-reg-(pdl)-cua/05:01; +reg/18`

---

## Quick Copy

**URL to Open:**
```
https://nonprd-delta.stopandshop.com/
```

**User Agent to Set:**
```
qa-reg-(pdl)-cua/05:01; +reg/18
```

---

## For Other OPCOs

### Giant Food (Delta)
```
URL: https://nonprd-delta.giantfood.com/
User Agent: qa-reg-(pdl)-cua/05:01; +reg/18
```

### Food Lion (Delta)
```
URL: https://nonprd-delta.foodlion.com/
User Agent: qa-reg-(pdl)-cua/05:01; +reg/18
```

### Hannaford (Delta)
```
URL: https://nonprd-delta.hannaford.com/
User Agent: qa-reg-(pdl)-cua/05:01; +reg/18
```

---

## Troubleshooting

### Still seeing security block?
1. Verify user agent is set correctly (no extra spaces)
2. Make sure "Use browser default" is unchecked
3. Reload the page after setting user agent
4. Clear browser cache if needed

### Need to test Beta environment?
Replace `delta` with `beta` in URL:
```
https://nonprd-beta.stopandshop.com/
```

---

## Keyboard Shortcuts Reference

| Action | Mac | Windows |
|--------|-----|---------|
| Open DevTools | `Cmd+Option+I` | `Ctrl+Shift+I` |
| Command Palette | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| Reload Page | `Cmd+R` | `Ctrl+R` |
| Hard Reload | `Cmd+Shift+R` | `Ctrl+Shift+R` |

---

**Note:** Keep DevTools open while browsing to maintain the custom user agent.
