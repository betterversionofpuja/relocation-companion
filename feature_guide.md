# 📖 Feature Guide: Interactive Radar Charts & Weighted Scoring System

We have implemented two powerful features to elevate the relocation analysis engine in **Relocation Companion**:

1. **📊 Interactive Radar Charts (Visual Excellence)**
2. **🔢 Weighted User Priorities (Personalized Scoring System)**

This guide explains how these features work, the math behind them, and how they improve the user experience.

---

## 1. 📊 Interactive Radar Charts

### What it does:
Instead of forcing users to scroll through a long list of numbers, the engine projects the relocation profiles of both cities onto a 2D polygon chart. A single glance reveals each city's shape, showing its relative strengths and weaknesses.

### How it works:
* **Concentric Grid**: The chart draws 5 concentric hexagons representing levels of strength ($20\%, 40\%, 60\%, 80\%, 100\%$).
* **6 Key Dimensions**: We map the 9 CSV columns into 6 logical dimensions:
  1. **Affordability**: Merges Rent, Food, Transport, and Internet costs (lower cost = higher score).
  2. **Income**: Normalized average monthly salary.
  3. **Quality of Life**: Normalized Quality of Life Index.
  4. **Safety**: Safety Index.
  5. **Healthcare**: Healthcare Index.
  6. **Clean Air (Environment)**: Clean Air score (calculated as $100 - \text{Pollution Index}$).
* **Smooth Animations**: Built with `framer-motion`, the shapes dynamically morph when cities are swapped or when priority weights shift the underlying numbers.
* **Interactive Tooltips**: Hovering over any axis displays a detailed HTML popover showing the raw metric values (e.g. exact Rent, Food, or Safety Index scores) for both cities, making it easy to inspect details.
* **Visual Styling**: Colored in harmony with our dark mode theme:
  * **City 1 (Origin)** is rendered in **Sky Blue** with a soft glow.
  * **City 2 (Destination)** is rendered in **Emerald Green** with a soft glow.

---

## 2. 🔢 Weighted User Priorities (Scoring System)

### What it does:
By default, comparison websites count "raw wins" (e.g., if City A has lower rent and cheaper bread, it gets 2 wins). However, if you are relocating with children, **Safety** might be your absolute priority, making cheap bread irrelevant. 

The **Weighted Scoring System** lets you customize how much weight the comparison engine puts on:
1. **Finance (Economy)** (Cost of Living & Salary)
2. **Lifestyle (Safety & Health)** (Safety & Healthcare)
3. **Air Quality (Environment)** (Pollution)

### How it works under the hood:

#### A. Proportional Slider Adjustments (100% Constraint)
To ensure the math remains valid, the three weights must **always sum to exactly 100%**.
When you drag one slider by $\Delta$ (e.g. from $30\%$ to $40\%$), the engine automatically subtracts $\Delta$ from the other two sliders **proportionally** based on their current values. This creates a fluid, intuitive balancing experience.

#### B. Min-Max Normalization
Before weighting, raw metrics must be normalized to a consistent $0$ to $100$ scale:
* **Affordability Score** = Average of:
  * $\text{RentScore} = \max(0, 100 - (\text{Rent} / 3000) \times 100)$
  * $\text{FoodScore} = \max(0, 100 - \text{FoodIndex})$
  * $\text{TransportScore} = \max(0, 100 - \text{TransportIndex})$
  * $\text{InternetScore} = \max(0, 100 - (\text{Internet} / 150) \times 100)$
* **Income Score** = $\min(100, (\text{Salary} / 6000) \times 100)$
* **Lifestyle Score** = Average of:
  * $\text{QoLScore} = \min(100, (\text{QualityOfLife} / 200) \times 100)$
  * $\text{SafetyScore} = \text{SafetyIndex}$
  * $\text{HealthcareScore} = \text{HealthcareIndex}$
* **Environment Score** = $\max(0, 100 - \text{PollutionIndex})$

#### C. Overall Weighted Score Calculation
The overall score ($S$) for each city is calculated using the user's priority weights:
$$S = \frac{(S_{\text{economy}} \times W_{\text{economy}}) + (S_{\text{lifestyle}} \times W_{\text{lifestyle}}) + (S_{\text{environment}} \times W_{\text{environment}})}{100}$$

The city with the higher overall score is recommended as the **winner**.

#### D. Dynamic Confidence Rating
The recommendation confidence changes dynamically. If the overall scores of the two cities are extremely close, the engine suggests a **"Balanced move"** with lower confidence. If there is a large score gap, it suggests the winner with up to **$99\%$ confidence**.

---

## 🧠 Why We Implemented This

1. **Personalization**: Relocation is deeply personal. A student, a corporate family, and a retired couple all have different needs. This puts the user in control.
2. **True Comparison Value**: Raw win counts are misleading. A $1\%$ difference in food index should not cancel out a $50\%$ difference in safety. The weighted scoring reflects true trade-offs.
3. **State of the Art UX**: Adjusting the sliders updates the charts, scores, verdicts, and confidence ratings **instantly** without reloading or calling the server. This makes the interface feel alive and interactive.
