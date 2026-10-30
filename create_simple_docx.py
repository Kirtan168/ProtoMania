import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
import os

def create_simple_doc():
    doc = Document()

    # Standard clean margins
    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)

    # Clean default font
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)
    font.color.rgb = RGBColor(30, 30, 30)

    # 1. Main Title
    title = doc.add_paragraph()
    r_title = title.add_run("PROTOMANIA — Agile Product Backlog")
    r_title.font.name = 'Calibri'
    r_title.font.size = Pt(22)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(20, 60, 20) # Deep Green
    title.paragraph_format.space_after = Pt(2)

    sub = doc.add_paragraph()
    r_sub = sub.add_run("3 Agile Epics & 20 Prioritized User Stories (Sprint 1 & Sprint 2)\nWebsite: https://proto-mania-jms1.vercel.app/")
    r_sub.font.size = Pt(11)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(100, 100, 100)
    sub.paragraph_format.space_after = Pt(16)

    # Divider
    div = doc.add_paragraph()
    div.paragraph_format.space_after = Pt(16)
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="1" w:color="888888"/></w:pBdr>')
    div._p.get_or_add_pPr().append(pBdr)

    # 2. Executive Summary
    h_sum = doc.add_heading("Product Overview", level=1)
    h_sum.style.font.color.rgb = RGBColor(20, 60, 20)
    
    p_sum = doc.add_paragraph(
        "PROTOMANIA ('Your Body. Your Budget. Your Era.') is an AI-powered fitness, nutrition, and budget optimizer "
        "built specifically for Indian college students. It solves the nutrition gap for hostel students living on strict "
        "daily allowances (₹30 to ₹150/day) with mess food and electric kettle cooking constraints. It uses algorithmic "
        "knapsack optimization to maximize protein intake using affordable Indian staples (Soya chunks, Sattu, Eggs, Peanuts, "
        "Besan/Moong Chillas, Paneer, and Dahi)."
    )
    p_sum.paragraph_format.space_after = Pt(16)

    # 3. The 3 Epics
    h_epics = doc.add_heading("Part 1: The 3 Core Epics", level=1)
    h_epics.style.font.color.rgb = RGBColor(20, 60, 20)

    epics = [
        ("EPIC 1: Algorithmic Student Budget Protein Optimizer (EPIC-OPT)",
         "Theme: Cost-constrained deterministic nutrition optimization.",
         "Goal: Allow broke college students to input their exact daily pocket money (₹40–₹200/day) and algorithmically generate the highest-protein combination of affordable Indian staples within hostel cooking limits.",
         "Key Capabilities: Knapsack linear budget solver, living reality filters (Hostel kettle / Mess survival / Zero-cook), custom campus Kirana price overrides, ₹50 broke challenge, and real-time Protein Price Radar."),
        
        ("EPIC 2: 7-Day Day-Wise Diet Planner & Bulk Campus Procurement (EPIC-PLAN)",
         "Theme: Practical, varied day-by-day hostel meal execution and raw ingredient procurement.",
         "Goal: Provide a structured, day-by-day (Monday to Sunday) recipe schedule with daily variety (Moong/Besan Chilla, Egg Bhurji, Paneer Bhurji, Soya Pulao, Chicken Curry, Tawa Fish) so students avoid dietary fatigue and can buy ingredients in bulk.",
         "Key Capabilities: Interactive Monday–Sunday timeline tabs, Veg/Egg/Non-Veg preference switcher, 1-click bulk 7-day grocery list with raw weights, daily pocket money tracker, and +50 XP meal logging."),
        
        ("EPIC 3: Gen-Z Gamification, Campus Social Squads & AI Fitness Buddy (EPIC-GENZ)",
         "Theme: Student habit retention, peer motivation, and conversational AI guidance.",
         "Goal: Keep students motivated through gamified levels, consistency streaks, private campus hostel squads, monthly shareable recaps, and an AI buddy answering dorm cooking and mess survival questions.",
         "Key Capabilities: Leveling from Iron Cadet to Campus Beast, privacy-first squad leaderboards, Broke but Building emergency solver, conversational AI buddy, and Spotify-style Fitness Wrapped recap cards.")
    ]

    for title, theme, goal, cap in epics:
        h = doc.add_heading(title, level=2)
        h.style.font.color.rgb = RGBColor(30, 80, 140)
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)

        p = doc.add_paragraph()
        r = p.add_run(theme + "\n")
        r.font.bold = True
        p.add_run(goal + "\n\n")
        r_c = p.add_run("Scope: ")
        r_c.font.bold = True
        p.add_run(cap)
        p.paragraph_format.space_after = Pt(12)

    doc.add_page_break()

    # 4. Sprint Overview Table
    h_sprints = doc.add_heading("Part 2: Sprint Prioritization & Allocation", level=1)
    h_sprints.style.font.color.rgb = RGBColor(20, 60, 20)

    doc.add_paragraph("The 20 user stories are split into two 2-week sprints based on foundational dependency and user value:")

    # Sprint 1 Table
    doc.add_heading("Sprint 1: Core MVP & Algorithmic Foundation (10 Stories, 48 Story Points)", level=2)
    t1 = doc.add_table(rows=11, cols=5)
    t1.style = 'Table Grid'
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER

    headers = ["ID", "User Story Title", "Epic", "Points", "Priority"]
    for j, h in enumerate(headers):
        c = t1.cell(0, j)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9.5)

    s1_data = [
        ("US-01", "5-Step Student Onboarding & Target Engine", "EPIC-OPT", "5", "Must Have"),
        ("US-02", "Heuristic Knapsack Budget Protein Solver", "EPIC-OPT", "8", "Must Have"),
        ("US-03", "Real-Time Student Living Reality Filters", "EPIC-OPT", "5", "Must Have"),
        ("US-07", "Protein Price Radar (₹ per 10g Protein Index)", "EPIC-OPT", "3", "Should Have"),
        ("US-08", "Interactive 7-Day Day-Wise Schedule Navigation", "EPIC-PLAN", "8", "Must Have"),
        ("US-09", "Multi-Dietary Preference Switcher (Veg/Egg/Non-Veg)", "EPIC-PLAN", "3", "Must Have"),
        ("US-11", "Daily Real-Time Macro & Pocket Money Tracker", "EPIC-PLAN", "5", "Must Have"),
        ("US-12", "Single-Tap Meal Consumption Logging with XP", "EPIC-PLAN", "3", "Must Have"),
        ("US-13", "Hostel Kettle & Desk Cooking Protocols", "EPIC-PLAN", "3", "Should Have"),
        ("US-15", "Student XP Leveling & Consistency Streaks", "EPIC-GENZ", "5", "Should Have")
    ]

    for i, row in enumerate(s1_data, 1):
        for j, val in enumerate(row):
            c = t1.cell(i, j)
            p = c.paragraphs[0]
            p.add_run(val).font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Sprint 2 Table
    doc.add_heading("Sprint 2: Growth, Campus Squads & Intelligence (10 Stories, 50 Story Points)", level=2)
    t2 = doc.add_table(rows=11, cols=5)
    t2.style = 'Table Grid'
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER

    for j, h in enumerate(headers):
        c = t2.cell(0, j)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9.5)

    s2_data = [
        ("US-04", "Campus Kirana Custom Price Override Tool", "EPIC-OPT", "5", "Should Have"),
        ("US-05", "Smart High-Protein Substitutions Engine", "EPIC-OPT", "5", "Should Have"),
        ("US-06", "The '₹50 Broke Student Challenge' Solver", "EPIC-OPT", "3", "Should Have"),
        ("US-10", "One-Click 7-Day Bulk Grocery Haul Generator", "EPIC-PLAN", "5", "Must Have"),
        ("US-14", "Budget-Saving Ingredient Swaps on Meal Cards", "EPIC-PLAN", "3", "Should Have"),
        ("US-16", "Privacy-First Campus & Hostel Squad Leaderboards", "EPIC-GENZ", "8", "Should Have"),
        ("US-17", "'Broke but Building' Emergency Solver", "EPIC-GENZ", "3", "Should Have"),
        ("US-18", "Conversational AI Fitness Buddy", "EPIC-GENZ", "8", "Should Have"),
        ("US-19", "Spotify-Style 'Fitness Wrapped' Monthly Recap Card", "EPIC-GENZ", "5", "Could Have"),
        ("US-20", "Hostel Mess Menu OCR & Plate Vision Helper", "EPIC-GENZ", "8", "Could Have")
    ]

    for i, row in enumerate(s2_data, 1):
        for j, val in enumerate(row):
            c = t2.cell(i, j)
            p = c.paragraphs[0]
            p.add_run(val).font.size = Pt(9.5)

    doc.add_page_break()

    # 5. All 20 Stories in Simple List Format
    h_stories = doc.add_heading("Part 3: Complete 20 User Stories Specification", level=1)
    h_stories.style.font.color.rgb = RGBColor(20, 60, 20)

    stories_full = [
        # Sprint 1
        ("US-01", "5-Step Student Onboarding & Target Engine", "EPIC-OPT", "Sprint 1", "5 Points", "Must Have",
         "As an Indian college student starting my fitness journey,\nI want a 5-step onboarding wizard calculating my BMR, TDEE, and daily protein targets based on my biometrics and budget,\nSo that I have a scientifically tailored plan without hiring an expensive coach.",
         [
             "GIVEN a new or guest student user on `#/onboarding`,",
             "WHEN they input age, height, weight, activity level, and daily budget (₹),",
             "THEN the system computes deterministic BMR using Mifflin-St Jeor and WHO activity multipliers, saves profile, displays Day 1 baseline targets (starting protein at 0g consumed), and awards +150 Onboarding XP."
         ]),
        
        ("US-02", "Heuristic Knapsack Budget Protein Solver", "EPIC-OPT", "Sprint 1", "8 Points", "Must Have",
         "As a broke college hosteler,\nI want to input my exact daily pocket money (e.g., ₹60, ₹80, ₹100, ₹120) and have the system algorithmically assemble the maximum protein combination,\nSo that I never waste money on low-protein junk food.",
         [
             "GIVEN a target budget and dietary preference,",
             "WHEN the student triggers the optimizer via POST /api/optimizer/solve,",
             "THEN a constrained greedy knapsack algorithm returns a feasible food allocation, itemizing total cost, total protein (g), leftover change, and efficiency metrics."
         ]),

        ("US-03", "Real-Time Student Living Reality Filters", "EPIC-OPT", "Sprint 1", "5 Points", "Must Have",
         "As a hosteler without a kitchen,\nI want to toggle between 'Hostel Mode' (kettle only), 'Mess Survival', and 'Zero-Cook',\nSo that the optimizer only recommends foods I can actually prepare in my dorm room.",
         [
             "GIVEN the food optimizer and meal views,",
             "WHEN the student selects 'Zero-Cook' or 'Hostel Mode',",
             "THEN foods requiring induction/gas stoves or refrigeration are filtered out, leaving kettle-friendly foods like soya chunks, sattu, roasted peanuts, and bananas."
         ]),

        ("US-07", "Protein Price Radar (₹ per 10g Protein Index)", "EPIC-OPT", "Sprint 1", "3 Points", "Should Have",
         "As a smart student shopper,\nI want to view a real-time price radar ranking all Indian staples by cost per 10 grams of protein,\nSo that I know which grocery items provide the highest nutritional ROI.",
         [
             "GIVEN the #/radar view,",
             "WHEN the page loads,",
             "THEN a sorted bar graph and price table render staples from lowest cost/10g protein (Soya Chunks at ₹4.5/10g, Sattu at ₹7.5/10g) to expensive commercial proteins, highlighting 'Campus Value Kings'."
         ]),

        ("US-08", "Interactive 7-Day Day-Wise Schedule Navigation", "EPIC-PLAN", "Sprint 1", "8 Points", "Must Have",
         "As a fitness-focused student,\nI want to navigate my meal plan day-by-day (Monday to Sunday) with distinct recipes and day themes,\nSo that I don’t get bored eating the same static meal every day.",
         [
             "GIVEN the Diet Plans view (`#/meals`),",
             "WHEN the student clicks on pill buttons [Mon], [Tue], [Wed], [Thu], [Fri], [Sat], [Sun],",
             "THEN the timeline immediately updates that day's specific meal cards (Breakfast, Lunch, Snack, Dinner), planned cost, macros, and preparation protocol with zero page refresh."
         ]),

        ("US-09", "Multi-Dietary Preference Switcher (Veg / Egg / Non-Veg)", "EPIC-PLAN", "Sprint 1", "3 Points", "Must Have",
         "As an eggetarian or vegetarian lifter,\nI want to switch my dietary preference on the fly,\nSo that all 7 days immediately populate with compliant Indian recipes (e.g., Egg Bhurji & Masala Omelette vs. Moong Chilla & Paneer Bhurji).",
         [
             "GIVEN the meal plan controls bar,",
             "WHEN the user clicks '🌱 Veg', '🥚 Egg', or '🍗 Non-Veg',",
             "THEN the schedule re-renders with certified diet-compliant meals and updates the user profile state."
         ]),

        ("US-11", "Daily Real-Time Macro & Pocket Money Tracker", "EPIC-PLAN", "Sprint 1", "5 Points", "Must Have",
         "As a busy student,\nI want to see a live visual dashboard of my planned vs. consumed protein, calories, and remaining pocket money for today,\nSo that I know exactly where I stand at any moment.",
         [
             "GIVEN the student opens `#/dashboard`,",
             "WHEN the dashboard loads,",
             "THEN animated counters display today's consumed protein (starting at 0% for new onboardings), budget spent, budget remaining, and meal checklist."
         ]),

        ("US-12", "Single-Tap Meal Consumption Logging with XP", "EPIC-PLAN", "Sprint 1", "3 Points", "Must Have",
         "As a student eating a scheduled meal,\nI want to click 'Mark Eaten',\nSo that my daily consumed protein increases and I earn Anabolic XP toward leveling up.",
         [
             "GIVEN any meal card in `#/meals` or `#/dashboard`,",
             "WHEN the student taps 'Mark Eaten (+50 XP)',",
             "THEN POST /api/meals/log records the meal, the button updates to 'Logged ✓', a success toast appears, and the user's total XP increases by +50."
         ]),

        ("US-13", "Hostel Kettle & Desk Cooking Preparation Protocols", "EPIC-PLAN", "Sprint 1", "3 Points", "Should Have",
         "As a hosteler cooking in a dorm room,\nI want clear 2-sentence micro-recipes detailing exact preparation steps (under 10 minutes),\nSo that I can cook without elaborate kitchen equipment.",
         [
             "GIVEN any meal card on the timeline,",
             "WHEN viewed by the student,",
             "THEN it presents prep time (e.g., '8 mins'), cooking method ('kettle_or_stove'), and actionable hostel instructions (e.g., 'Boil soya chunks in electric kettle for 4 mins, squeeze out excess water, toss with chaat masala')."
         ]),

        ("US-15", "Student XP Leveling, Anabolic Cadet Ranks & Consistency Streaks", "EPIC-GENZ", "Sprint 1", "5 Points", "Should Have",
         "As a student building daily discipline,\nI want to accumulate XP and climb fitness ranks (from Level 1: Iron Cadet up to Campus Beast),\nSo that maintaining my diet feels like an engaging video game.",
         [
             "GIVEN a logged-in or guest student session,",
             "WHEN they log meals (+50 XP) or complete daily consistency check-ins,",
             "THEN their streak counter increments, their level progress bar advances, and milestone level-up toasts trigger."
         ]),

        # Sprint 2
        ("US-04", "Campus Kirana Custom Price Override Tool", "EPIC-OPT", "Sprint 2", "5 Points", "Should Have",
         "As a student whose campus canteen charges different prices than national averages (e.g., ₹7/egg instead of ₹6),\nI want to override food unit prices,\nSo that my optimized budget matches my local Kirana reality.",
         [
             "GIVEN any food card in the optimizer directory,",
             "WHEN the user edits the unit price and clicks 'Update Price',",
             "THEN POST /api/optimizer/price-override persists the custom rate in food_price_overrides and recalculates the knapsack allocation with the updated price."
         ]),

        ("US-05", "Smart High-Protein Substitutions Engine", "EPIC-OPT", "Sprint 2", "5 Points", "Should Have",
         "As a student who dislikes certain foods (or when an item is out of stock at the campus store),\nI want to click a 'Swap' button on any allocated food,\nSo that I can see comparable protein alternatives within the same price band.",
         [
             "GIVEN a solved meal item (e.g., Soya Chunks 50g),",
             "WHEN the student clicks the swap button (POST /api/optimizer/substitute),",
             "THEN the modal surfaces at least 3 smart swaps (e.g., Roasted Bhuna Chana or Sattu) that fit within ±₹5 and maintain protein within 15%."
         ]),

        ("US-06", "The '₹50 Broke Student Challenge' Solver", "EPIC-OPT", "Sprint 2", "3 Points", "Should Have",
         "As a student at month-end with almost zero funds,\nI want a 1-click solver that maximizes protein strictly under ₹50/day,\nSo that I maintain muscle even during severe financial crunches.",
         [
             "GIVEN the optimizer view,",
             "WHEN the student taps '₹50 Broke Challenge',",
             "THEN GET /api/optimizer/50-rupee-challenge returns an ultra-lean staple combo (Sattu drink + Soya chunks + Peanuts) delivering over 65g protein for under ₹48."
         ]),

        ("US-10", "One-Click 7-Day Bulk Grocery Haul Generator", "EPIC-PLAN", "Sprint 2", "5 Points", "Must Have",
         "As a hosteler who visits the market once a week,\nI want to click 'Generate 7-Day Grocery List',\nSo that I receive an aggregated raw shopping list with total quantities (e.g., 500g Sattu, 14 Eggs, 350g Oats) and bulk buying hacks.",
         [
             "GIVEN the Diet Plans view,",
             "WHEN the student clicks 'Generate 7-Day Grocery List',",
             "THEN a modal opens displaying aggregated weekly spend, average daily cost, bulk shopping items with shelf-life tags, and campus procurement tips (e.g., buying a 30-egg tray to save ₹2/egg)."
         ]),

        ("US-14", "Budget-Saving Ingredient Swaps on Meal Cards", "EPIC-PLAN", "Sprint 2", "3 Points", "Should Have",
         "As a student looking to save extra pocket money,\nI want each meal card to feature a 'Budget-Saving Swap' tip,\nSo that I know how to trim costs if my funds run low before month-end.",
         [
             "GIVEN any active day's meal cards,",
             "WHEN the card renders,",
             "THEN a dedicated green-bordered tip box suggests a practical money-saving swap (e.g., 'Swap 100g paneer for 60g soya chunks to save ₹28 while gaining +6g protein')."
         ]),

        ("US-16", "Privacy-First Campus & Hostel Squad Leaderboards", "EPIC-GENZ", "Sprint 2", "8 Points", "Should Have",
         "As a hosteler lifting with floor-mates,\nI want to join or create a private college squad with an invite code,\nSo that we can compete on consistency streaks and XP without revealing sensitive biometric weights.",
         [
             "GIVEN the `#/squad` view,",
             "WHEN a user creates a squad or enters an invite code,",
             "THEN they join the squad leaderboard; rankings show XP and streak days only, completely anonymizing body weight and personal medical notes."
         ]),

        ("US-17", "'Broke but Building' Emergency Solver", "EPIC-GENZ", "Sprint 2", "3 Points", "Should Have",
         "As a student with random loose change in my pocket (e.g., ₹15 or ₹25),\nI want to enter that exact amount and instantly receive the highest-protein street or canteen snack available,\nSo that I don't buy junk chips.",
         [
             "GIVEN the `#/broke-building` interactive tool,",
             "WHEN the student enters an amount between ₹10 and ₹50,",
             "THEN POST /api/genz/broke-building returns street-smart combos (e.g., ₹15 = 2 Boiled Eggs with black pepper or 40g roasted bhuna chana)."
         ]),

        ("US-18", "Conversational AI Fitness Buddy (Campus & Hostel Engine)", "EPIC-GENZ", "Sprint 2", "8 Points", "Should Have",
         "As a confused college lifter,\nI want to chat with an AI buddy in natural student lingo,\nSo that I can ask questions about kettle cooking, mess food survival, and cheap protein on campus.",
         [
             "GIVEN the `#/assistant` chat view,",
             "WHEN the user sends a query (e.g., 'How to get 30g protein for ₹20 in my room?'),",
             "THEN POST /api/ai/chat responds with structured, realistic advice citing verified Indian staples, with zero hallucination."
         ]),

        ("US-19", "Spotify-Style 'Fitness Wrapped' Monthly Recap Card", "EPIC-GENZ", "Sprint 2", "5 Points", "Could Have",
         "As an active student user,\nI want a shareable graphical summary card of my monthly progress (total grams of protein consumed, money saved, consistency streak),\nSo that I can post it on Instagram or WhatsApp stories.",
         [
             "GIVEN the `#/wrapped` view,",
             "WHEN the monthly recap generates,",
             "THEN a visually striking card displays total protein consumed (kg), campus ranking percentile, money saved vs. whey protein, and a 'Share to Story' download button."
         ]),

        ("US-20", "Hostel Mess Menu OCR & Plate Vision Helper", "EPIC-GENZ", "Sprint 2", "8 Points", "Could Have",
         "As a hosteler eating at a campus mess,\nI want to upload a photo of the weekly mess noticeboard menu,\nSo that the AI can highlight which dishes have the highest protein content.",
         [
             "GIVEN the `#/optimizer` or `#/assistant` tool,",
             "WHEN a student uploads an image of a mess menu schedule,",
             "THEN POST /api/genz/vision-menu parses the meal text, identifies protein-rich options (Dal, Rajma, Chole, Dahi, Paneer day), and advises supplemental staples to bridge the protein gap."
         ])
    ]

    for uid, title, epic, sprint, pts, prio, story, acs in stories_full:
        h = doc.add_heading(f"{uid}: {title}", level=2)
        h.style.font.color.rgb = RGBColor(30, 80, 140)
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(2)

        meta_p = doc.add_paragraph()
        r_meta = meta_p.add_run(f"Epic: {epic}  |  Sprint: {sprint}  |  Estimate: {pts}  |  Priority: {prio}")
        r_meta.font.bold = True
        r_meta.font.size = Pt(9.5)
        r_meta.font.color.rgb = RGBColor(120, 60, 20)
        meta_p.paragraph_format.space_after = Pt(4)

        p_s = doc.add_paragraph()
        r_sl = p_s.add_run("User Story:\n")
        r_sl.font.bold = True
        p_s.add_run(story)
        p_s.paragraph_format.space_after = Pt(4)

        p_a = doc.add_paragraph()
        r_al = p_a.add_run("Acceptance Criteria:")
        r_al.font.bold = True
        p_a.paragraph_format.space_after = Pt(2)

        for ac in acs:
            p_item = doc.add_paragraph(ac, style='List Bullet')
            p_item.paragraph_format.space_before = Pt(0)
            p_item.paragraph_format.space_after = Pt(1)

        # Small divider between stories
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 6. Definition of Done
    doc.add_page_break()
    h_dod = doc.add_heading("Part 4: Definition of Done (DoD)", level=1)
    h_dod.style.font.color.rgb = RGBColor(20, 60, 20)

    dods = [
        "Functional Verification: All acceptance criteria tested and passing against backend APIs and frontend UI.",
        "Mobile Viewport Testing: Validated on standard mobile screens (360px–420px width) since students primarily use phones.",
        "Codebase Parity: Full synchronization between /app and /public static build directories.",
        "Performance Standard: Knapsack optimizer and 7-day schedule render within 300 milliseconds.",
        "Image Resiliency: Verified that all food images have active onerror fallback handlers with zero broken icons."
    ]

    for d in dods:
        p = doc.add_paragraph(d, style='List Bullet')
        p.paragraph_format.space_after = Pt(4)

    # Save to all target paths
    paths = [
        r"C:\Users\hp\OneDrive\Desktop\Mobile App PM\PROTOMANIA_Agile_User_Stories.docx",
        r"C:\Users\hp\OneDrive\Desktop\Mobile App PM\PROTOMANIA_Agile_Epics_and_User_Stories.docx",
        r"C:\Users\hp\OneDrive\Desktop\PROTOMANIA\app\static\downloads\PROTOMANIA_Agile_Epics_and_User_Stories.docx",
        r"C:\Users\hp\OneDrive\Desktop\PROTOMANIA\public\static\downloads\PROTOMANIA_Agile_Epics_and_User_Stories.docx"
    ]

    for p in paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        doc.save(p)
        print(f"Created: {p}")

if __name__ == "__main__":
    create_simple_doc()
