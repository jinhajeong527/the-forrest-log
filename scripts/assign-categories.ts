import * as fs from "fs";
import * as path from "path";

// Scraped from tummee.com with Forrest style filter active
// Each array = poses that appear under that filter
const TUMMEE_CATEGORIES = {
  BACKBENDS: ["Low Lunge Pose","Reverse Warrior Pose","Bridge Pose","Cobra Pose","Sphinx Pose","Half Pigeon Pose","Extended Mountain Pose With Backbend","Locust Pose","Upward Facing Dog Pose","Fish Pose","Bow Pose","Wild Thing Pose","Camel Pose","Tiger Pose Variation 1","Camel Pose Variation 1","Cobra Pose Elbows Bent","Bridge Pose Variation Arms Flow I","One Legged Bridge Pose","Standing Backbend Pose","Superman Pose","Mountain Pose Cactus Arms Backbend","Cow Pose","Hands Bound Rising Locust Pose","Pyramid Pose Prep With Backbend","Locust Pose Bound Hands","Crescent Low Lunge Easy Revolved Side Angle Pose Flow","Low Lunge Pose Hands Behind Head Cat Cow Flow","Woodchopper Pose Flow","Cobra Pose Variation Elbows Back","Upward Facing Dog Pose Leg To Side"],
  BALANCING_POSES: ["Mountain Pose","Tree Pose","Mountain Pose Namaste","Warrior Pose Iii","Balancing Table Pose","Eagle Pose","Low Lunge Hands To Knee","Half Chair Pose","Side Plank Pose Variation (one Knee On The Floor)","Half Moon Variation (knee On The Floor)","Beginner Tree Pose","Standing Balance One Leg Raised","Flamingo Pose","Standing Hand To Knee Pose","Mountain Pose Variation Feet Hip Wide","Bird of Paradise Pose","Boat Pose Block Between Knees","Low Lunge Triceps Stretching","Standing Pigeon Pose","Half Moon Pose Block Wall","Upward Abdominal Lock Close Up","Easy Side Reclining Pose"],
  FORWARD_BENDS: ["Standing Forward Fold Pose","Wide Child Pose","Upward Forward Fold Hands On Shins","Intense Leg Stretch Pose","Seated Forward Bend Pose","Flow I","Head To Knee Pose","Dangling Pose","Three Legged Downward Facing Dog Pose Variation Stacked","Boat Pose","Half Splits Pose","Standing Spinal Roll Up Pose Flow","Sleeping Swan Pose","Seated Straddle Pose","Thread The Needle Pose","Standing Split Pose","Intense Side Stretch Pose","Forward Fold Flow","Standing Forward Fold Pose Variation Knees Bent","Humble Warrior Pose","Revolved Standing Forward Fold Pose Variation Knee Bent","Intense Leg Stretch Pose C","Upward Forward Fold Pose","Intense Leg Stretch Pose D","Garland Pose Standing Forward Bend Pose Flow","Downward Facing Dog Pose Variation One Knee Bent","Warrior Pose I Bound Hands Humble Warrior Flow","Wide Legged Forward Bend Pose Variation Both Hands On One Ankle","Pyramid Pose Hands On Blocks","Sun Salutation A Second Half","Downward Facing Dog Pose Variation Knees Bent","Standing Straddle Forward Bend Pose","Warrior Pose Ii Wide Legged Forward Bend Flow","Garland Pose","Seated Forward Bend With Strap","Intense Leg Stretch Pose B","Squat Easy Forward Fold Flow","Wide Legged Forward Bend Pose Ii","Pyramid Pose","Wide Legged Forward Bend Pose","Standing Forward Fold Pose Arms Out To Side","Supported Downward Facing Dog Pose","Child Pose Flow","Standing Forward Fold Clasp Hands Pose","Pyramid Pose Blocks","Wide Legged Seated Forward Bend Pose"],
  INVERSIONS: ["Downward Facing Dog Pose","Three Legged Downward Facing Dog Pose","Shoulderstand Pose","Plough Pose","Dolphin Pose","One Legged Bridge Pose Legs Flow","One Legged Dolphin Pose"],
  TWISTS: ["Supine Spinal Twist Pose Ii","Supine Spinal Twist Yoga Pose I","Thread The Needle Pose Flow","Revolved Lunge Pose","Revolved Chair Pose","Half Lord Of The Fishes Pose Variation Hand Up Leg","Seated Windshield Wiper Pose","Revolved Easy Pose","Revolved Side Angle Pose","Revolved Low Lunge Pose Knee On The Floor","Revolved Wide Legged Forward Bend Pose","Revolved Low Lunge Pose Variation 1","Revolved High Lunge Pose","Revolved Squat Pose","Reclining Eagle Spinal Twist Pose","Easy Revolved Side Angle Pose","Revolved Triangle Pose","Revolved Bound Angle Pose","Sage Marichi Pose C","Standing Twist Opposite Hand to Knee Pose","Revolved Cobra Pose","Half Lord Of The Fishes Pose Variation Hand Up","Scorpion Twist Pose","Revolved Chair Pose Easy Stretch","Revolved Table Top Pose One Hand Raised","Twisted Reverse Warrior Pose","Revolved Chair Pose Variation","Supine Spinal Twist Eagle Legs Pose","Side Reclined Shoulder Stretch A Supine Spinal Twist Pose","Twisted Dragon","Twisted Lizard Pose","Revolved Downward Facing Dog Pose","Supine Windshield Wiper Twist Pose","Crescent Low Lunge Easy Revolved Side Angle Pose Flow","Revolved Standing Forward Fold Pose Variation Knee Bent","Spinal Roll Pose Flow","Revolved Standing Straddle Forward Bend Pose","Seated Twists Flow","Half Lord Of The Fishes Pose","Easy Twist Pose Flow","Revolved Low Lunge Pose","Sage Marichi Pose A","Cat Cow Pose With Leg To Side","Revolved Warrior Pose","Rotator Cuff Stretch Pose"],
  ABDOMINALS: ["Wide Child Pose","Flow I","Cobra Pose","Sphinx Pose","Crocodile Pose","Locust Pose","Upward Facing Dog Pose","Sleeping Swan Pose","Bow Pose","Belly Down Vinyasa","Cobra Pose Elbows Bent","Sphinx Pose With Half Frog Pose Legs","Revolved Cobra Pose","Reverse Corpse Pose","Superman Pose","Locust Pose Legs On Floor","Locust Pose Bound Hands","Cobra Dance Flow","Revolved Cobra Pose Arm On Leg","Cobra Pose Variation Elbows Back"],
  ARM_BALANCES: ["Sun Salutation A","Three Legged Downward Facing Dog Pose Tiger Curl Pose Flow","Balancing Table Pose","Three Legged Downward Facing Dog Pose Variation Stacked","Balancing Table Pose With Knee To Nose Flow","Sun Salutation B","Lizard Pose","Half Moon Variation (knee On The Floor)","Downward Facing Dog Pose Plank Pose Flow","Standing Split Pose","Dolphin Pose","Forearm Plank Pose","Tiger Pose Variation 1","Belly Down Vinyasa","Upward Plank Pose","Table Top Pose Knees Up","Twisted Dragon","Revolved Downward Facing Dog Pose","Revolved Cobra Pose","Revolved Table Top Pose One Hand Raised","Plank Pose Knees Bent","Classic Sun Salutation Variation","Warrior Pose Iii Blocks","Table Top Pose  Lateral Leg Lift Flow","Side Plank Pose Variation Tree Leg","Twisted Lizard Pose","Side Plank Pose Arm Overhead","Dolphin Plank Variation One Leg Raised","Revolved Cobra Pose Arm On Leg","Half Moon Pose Block Wall","Sun Salutation Variation Quick Flow"],
  STANDING_POSES: ["Downward Facing Dog Pose","Mountain Pose","Standing Forward Fold Pose","Warrior Pose Ii","Runners Lunge Pose","High Lunge Pose","Chair Pose","Low Lunge Pose","Warrior Pose I","Reverse Warrior Pose","Upward Forward Fold Hands On Shins","Volcano Pose","Triangle Pose","Intense Leg Stretch Pose","Tree Pose","Mountain Pose Namaste","Sun Salutation A","Warrior Pose Iii","Extended Side Angle Pose","Revolved Lunge Pose","Goddess Pose","Dangling Pose","Three Legged Downward Facing Dog Pose Variation Stacked","Revolved Chair Pose","Extended Side Angle Pose Variation Elbow Arm","Five Pointed Star Pose","Extended Mountain Pose With Backbend","Standing Spinal Roll Up Pose Flow","Half Moon Pose","Sun Salutation","Standing Wind Release Pose","Eagle Pose","Sun Salutation B","Palm Tree Pose Side Bend","Revolved Side Angle Pose","Five Pointed Star Pose Arms Up","Low Lunge Hands To Knee","Revolved Low Lunge Pose Knee On The Floor","Half Chair Pose","Palm Tree Pose","Dancer Pose","Revolved High Lunge Pose","Pyramid Pose","Wide Legged Forward Bend Pose","Warrior Pose I Bound Hands Humble Warrior Flow","Humble Warrior Pose","Forward Fold Flow","Crescent Lunge Pose","Warrior Pose Ii Wide Legged Forward Bend Flow","Chair Pose With Eagle Arms","Revolved Triangle Pose","Standing Split Pose","Intense Side Stretch Pose","Fierce Pose Variation","Standing Forward Fold Pose Variation Knees Bent","Revolved Squat Pose","Five Pointed Star Pose Arms Out","Crescent High Lunge Pose Blocks","Palm Tree Pose Salutation","Garland Pose Standing Forward Bend Pose Flow","Mountain Pose Variation Feet Hip Wide","Warrior Ii Reverse Warrior Flow","Revolved Chair Pose Easy Stretch","Revolved Chair Pose Variation","Palm Tree Pose Lateral Hip Side Stretch","Warrior Pose Iii Blocks","Revolved Standing Forward Fold Pose Variation Knee Bent","Low Lunge Triceps Stretching","Standing Straddle Forward Bend Pose","Upward Forward Fold Pose","Standing Pigeon Pose","Mountain Pose Cactus Arms Backbend","Tadasana Lateral Bend Flow","Standing Balance One Leg Raised","Standing Hand To Knee Pose","Bird of Paradise Pose","Flamingo Pose","Wide Legged Forward Bend Pose Ii","Twisted Reverse Warrior Pose","Revolved Standing Straddle Forward Bend Pose","Standing Backbend Pose","Warrior Pose Ii Variation Hands Behind Back","Half Moon Variation (knee On The Floor)","Standing Twist Opposite Hand to Knee Pose","Fierce Pose Ii","Low Lunge Pose Variation 1","Tree Pose Trunk Twist","Revolved Warrior Pose","Five Pointed Star Pose Lateral Hip Stretch","Warrior Pose I Bound Hands","Standing Forward Fold Pose Arms Out To Side","Standing Forward Fold Clasp Hands Pose","Classic Sun Salutation Variation","Crescent Lunge Easy Revolved Side Angle Pose","Mountain Pose Neutral","Crescent High Lunge Variation 2","Chair Pose Fingertip Touch","Intense Leg Stretch Pose B","Warrior Pose I Variation","Standing Forward Fold Pose Hands To Elbows","Mountain Pose Forward Bend Flow","Beginner Tree Pose","Standing Straddle Forward Bend Variation","Squat Easy Forward Fold Flow","Chair Pose Cactus Arms","Low Lunge Pose Hands Behind Head Cat Cow Flow","Chair Pose Variation","Runners Lunge Pose Variation","Sun Salutation Variation Quick Flow","Warrior Pose I Foot Position","High Lunge Pose Fingertip Touch","Mountain Pose Forward Fold Flow","Classic Sun Salutation","Crescent Lunge Pose Variation","Wide Legged Forward Bend Pose Variation Both Hands On One Ankle","Easy Side Reclining Pose","Warrior Pose Ii Quad Stretch","Sun Salutation A Second Half","Supported Downward Facing Dog Pose","Pyramid Pose Hands On Blocks","Mountain Pose Flow","Revolved Low Lunge Pose","Woodchopper Pose Flow","Garland Pose","Pyramid Pose Blocks","Crescent Low Lunge Ease Revolved Side Angle Pose Flow","Mountain Pose Lateral Bend","Revolved Low Lunge Pose Variation 1","Low Lunge Pose Hands Behind Head","Triangle Pose Blocks","Warrior Pose Iii Flow","Scorpion Twist Pose","Standing Forward Fold Pose Block","Extended Mountain Pose","Dancers Pose Prep","Mountain Pose Lateral Bend Ii","Dancer Pose Prep Wall","Crescent Lunge Namaste"],
  LUNGES: ["Table Top Pose","Cat Cow Pose","Child Pose","Low Lunge Pose","Puppy Dog Pose","Thread The Needle Pose Flow","Balancing Table Pose","Crescent Low Lunge Pose Variation Knee On Floor","Balancing Table Pose With Knee To Nose Flow","Half Splits Pose","Thread The Needle Pose","Low Lunge Hands To Knee","Revolved Low Lunge Pose Knee On The Floor","Camel Pose","Side Plank Pose Variation (one Knee On The Floor)","Half Moon Variation (knee On The Floor)","Tiger Pose Variation 1","Toe Squat","Table Top Pose Knees Up","Table Top Pose Wrist Stretch","Easy Revolved Side Angle Pose","Camel Pose Variation 1","Wild Thing Pose Knee To Floor Variation","Twisted Dragon","Half Splits Pose Block","Hero Pose","Crescent Low Lunge Pose Block","Revolved Table Top Pose One Hand Raised","Frog Pose I","Table Top Hip Circles","Plank Pose Knees Bent","Puppy Dog Pose Blocks","Cow Pose","Cat Cow Pose With Leg To Side","Rotator Cuff Stretch Pose","Cat Cow Pose Forearms","Crescent Low Lunge Pose Lateral Stretch","Lizard Pose","Low Lunge Pose Variation 1","Crescent Low Lunge Pose","Tiger Pose Variation 2","Twisted Lizard Pose","Low Lunge Pose Hands Behind Head","Crescent Low Lunge Easy Revolved Side Angle Pose Flow","Crescent Low Lunge Pose Blocks"],
  HIP_OPENERS: ["Standing Forward Fold Pose","Warrior Pose Ii","Cat Cow Pose","Wind Release Pose","Child Pose","Wide Child Pose","High Lunge Pose","Three Legged Downward Facing Dog Pose","Chair Pose","Low Lunge Pose","Warrior Pose I","Reverse Warrior Pose","Staff Pose","Happy Baby Pose","Intense Leg Stretch Pose","Seated Forward Bend Pose","Bound Angle Pose","Tree Pose","Supine Spinal Twist Yoga Pose I","Reverse Pigeon Pose","Sun Salutation A","Half Wind Release Pose","Warrior Pose Iii","Head To Knee Pose","Three Legged Downward Facing Dog Pose Tiger Curl Pose Flow","Half Pigeon Pose","Reclining Bound Angle Pose","Extended Side Angle Pose","Revolved Lunge Pose","Balancing Table Pose","Goddess Pose","Crescent Low Lunge Pose Variation Knee On Floor","Three Legged Downward Facing Dog Pose Variation Stacked","Revolved Chair Pose","Five Pointed Star Pose","Balancing Table Pose With Knee To Nose Flow","Seated Cat Cow Pose","Half Splits Pose","Supine Windshield Wiper Twist Pose","Half Moon Pose","Extended Side Angle Pose Variation Elbow Arm","Revolved Side Angle Pose","Revolved Low Lunge Pose Knee On The Floor","Lizard Pose","Seated Straddle Pose","Squat Pose","Sleeping Swan Pose","Standing Split Pose","Garland Pose","Half Pigeon Pose Flow","Revolved High Lunge Pose","Puppy Dog Pose","Supine Spinal Twist Eagle Legs Pose","Boat Pose","Reclined Big Toe Pose","Eagle Pose","Thread The Needle Pose Flow","Reclining Eagle Spinal Twist Pose","Bound Angle Pose Variation Forward Bend","Eye Of The Needle Pose","Frog Pose I","Reclined Big Toe Pose Straps","Twisted Dragon","Crescent Low Lunge Pose","Hip Flow","Happy Baby Half Happy Baby Flow","Garland Pose Standing Forward Bend Pose Flow","Low Lunge Pose Variation 1","Standing Pigeon Pose","Wide Legged Forward Bend Pose","Five Pointed Star Pose Arms Up","Revolved Chair Pose Variation","Revolved Chair Pose Easy Stretch","Crescent Low Lunge Pose Block","Pigeon Pose With Forward Fold","Lizard Pose Variation","Eye Of The Needle Pose Variation Ii","Tiger Pose Variation 2","Low Lunge Pose Hands Behind Head","Side Reclining Leg Lift Pose","Circle Of Joy","Low Lunge Pose Hands Behind Head Cat Cow Flow","Wide Legged Seated Forward Bend Pose","Squat Easy Forward Fold Flow","Revolved Standing Straddle Forward Bend Pose","Pigeon Pose Blocks","Wide Legged Forward Bend Pose Ii","Tree Pose Trunk Twist","Bound Angle Pose Block","Crescent Low Lunge Pose Lateral Stretch","Crescent Low Lunge Ease Revolved Side Angle Pose Flow","Warrior Pose I Foot Position","Revolved Low Lunge Pose","Reverse Pigeon Pose Flow","Lizard Pose Blocks","Twisted Lizard Pose","Cat Cow Pose With Leg To Side","Revolved Low Lunge Pose Variation 1","Circle Of Joy Standing Flow","Supine Butterfly Pose","Seated Windshield Wiper Pose","Easy Twist Pose Flow","Crescent Low Lunge Easy Revolved Side Angle Pose Flow","Seated Twists Flow"],
  RESTORATIVE: ["Corpse Pose","Mountain Pose","Wind Release Pose","Child Pose","Easy Pose","Wide Child Pose","Reverse Pigeon Pose","Half Wind Release Pose","Crocodile Pose","Reclining Bound Angle Pose","Easy Pose Variation Side Bend","Full Body Stretch Pose","Thunderbolt Pose","Seated Shoulder Rolls","Constructive Rest Pose","Supine Windshield Wiper Twist Pose","Sleeping Swan Pose","Easy Pose Warm Up Flow","Seated Windshield Wiper Pose","Seated Neck Rolls","Repeat Other Side","Meditation","Bridge Pose Block","Reclining Eagle Spinal Twist Pose","Pranayama","Repeat R L","Reclined Big Toe Pose Straps","Sphinx Pose With Half Frog Pose Legs","Wrist Joint Rotation","Reverse Corpse Pose","Supine Spinal Twist Eagle Legs Pose","Circle Of Joy","Puppy Dog Pose Blocks","Shoulders Lift And Drop Close Up","Eagle Arms Close Up","Rotator Cuff Stretch Pose","Eye Of The Needle Pose Variation Ii","Easy Pose Block","Circle Of Joy Standing Flow","Open Close Fingers","Music","Shoulder Salutation Sequence"],
  SEATED: ["Easy Pose","Staff Pose","Garland Pose","Seated Forward Bend Pose","Bound Angle Pose","Head To Knee Pose","Half Pigeon Pose","Easy Pose Variation Side Bend","Easy Pose Variation Arms Knees","Seated Torso Circles","Thunderbolt Pose","Boat Pose","Seated Cat Cow Pose","Half Splits Pose","Seated Shoulder Rolls","Easy Pose Neck Side Stretch","Easy Pose Warm Up Flow","Half Lord Of The Fishes Pose Variation Hand Up Leg","Seated Windshield Wiper Pose","Revolved Easy Pose","Seated Neck Rolls","Seated Straddle Pose","Butterfly Pose Variation Forward Bend","Chair Mountain Pose","Revolved Head To Knee Pose Prep","Side Plank Pose Variation (one Knee On The Floor)","Half Moon Variation (knee On The Floor)","Wide Legged Squat Over One Leg","Toe Squat","Revolved Squat Pose","Upward Plank Pose","Table Top Pose Wrist Stretch","Alternate Nostril Breathing","Wild Thing Pose Knee To Floor Variation","Cow Face Pose","Easy Boat Pose","Easy Pose Prayer Hands Variation Revolved Easy Pose Flow","Shoelace Pose","Firelog Pose","Hero Pose","Sage Marichi Pose A","Sage Marichi Pose C","Half Lord Of The Fishes Pose","Revolved Head To Knee Pose","Revolved Bound Angle Pose","Easy Pose Block","Bound Angle Pose Variation Forward Bend","Revolved Seated Angle Pose","Seated Twists Flow","Wide Legged Seated Forward Bend Pose","Boat Pose Block Between Knees","Seated Forward Bend With Strap","Revolved Bound Angle Pose Side Stretch"],
  SUPINE: ["Corpse Pose","Wind Release Pose","Bridge Pose","Happy Baby Pose","Supine Spinal Twist Pose Ii","Supine Spinal Twist Yoga Pose I","Reverse Pigeon Pose","Half Wind Release Pose","Reclining Bound Angle Pose","Full Body Stretch Pose","Constructive Rest Pose","Supine Windshield Wiper Twist Pose","Shoulderstand Pose","Fish Pose","Plough Pose","Reclined Knee Circles","Half Plough Pose","Bridge Pose Block","Reclining Eagle Spinal Twist Pose","Reclined Big Toe Pose Straps","Three Part Breath Corpse Pose","Bridge Pose Variation Arms Flow I","One Legged Bridge Pose","Half Happy Baby Pose Variation 1","Supine Spinal Twist Eagle Legs Pose","Side Reclined Shoulder Stretch A Supine Spinal Twist Pose Ii Flow","Banana Pose Variation","Dead Bug Core Series A","Eye Of The Needle Pose Variation Ii","One Legged Bridge Pose Legs Flow","Bicycle Pose Criss Cross Legs Flow","Reclined Eagle Crunches","Bridge Pose Eye Of The Needle Legs","Half Boat Pose Arms Forward Wind Release Pose Nose To Knee Flow","Dead Bug Pose Variation","Reclined Big Toe Pose","Side Reclining Leg Lift Pose","Supine Butterfly Pose","Eye Of The Needle Pose"],
};

// Manual overrides for poses not matched by any tummee filter
const MANUAL_OVERRIDES: Record<string, string[]> = {
  "Four Limbed Staff Pose": ["ARM_BALANCES"],
  "Crescent Low Lunge Hamstring Stretch Flow": ["FORWARD_BENDS", "LUNGES"],
  "Upward Salute Side Bend Pose": ["STANDING_POSES"],
  "Reverse Triangle Pose": ["FORWARD_BENDS", "STANDING_POSES"],
  "Extended Triangle Pose": ["FORWARD_BENDS", "STANDING_POSES"],
  "High Lunge Arms Extended Forward": ["LUNGES", "STANDING_POSES"],
  "Crescent High Lunge Shoulder Opener": ["LUNGES", "STANDING_POSES"],
  "Standing Hand To Big Toe Pose In Front": ["BALANCING_POSES", "STANDING_POSES"],
  "Standing Hand To Big Toe Pose": ["BALANCING_POSES", "STANDING_POSES"],
  "Bound Extended Side Angle Pose": ["STANDING_POSES"],
  "Plank Pose Four Limbed Staff Pose Flow": ["ARM_BALANCES"],
  "Upward Forward Fold Block": ["FORWARD_BENDS", "STANDING_POSES"],
  "Nectar Of The Moon Pose Ii": ["HIP_OPENERS", "SUPINE"],
  "Sage Twist Pose": ["SEATED", "TWISTS"],
  "Revolved Boat Pose Variation Knees Bent": ["ABDOMINALS", "TWISTS"],
  "Shoulder Rolls Bent Elbows Variation Close Up": ["RESTORATIVE"],
  "Seated Ear To Shoulder Pose": ["RESTORATIVE", "SEATED"],
  "Horse Pose Side Stretch": ["HIP_OPENERS", "STANDING_POSES"],
  "Head On Knee Pose Preparation": ["FORWARD_BENDS", "SEATED"],
  "One Legged Five Pointed Star Pose Side Bend": ["BALANCING_POSES", "STANDING_POSES"],
  "Warrior Ii Eagle Arms": ["STANDING_POSES"],
  "Head On Knee Pose C": ["FORWARD_BENDS", "SEATED", "TWISTS"],
  "Standing Side Bend Strap Pose": ["STANDING_POSES"],
  "Twist Half Chair Pose": ["STANDING_POSES", "TWISTS"],
  "Bear Pose Arms Out Yoga Sequence": ["ARM_BALANCES"],
  "Bird Of Paradise Prep Pose": ["BALANCING_POSES", "STANDING_POSES"],
  "Hovering Cat Pose": ["ARM_BALANCES", "LUNGES"],
  "Bharadvaja Twist Pose Ii Prep Variation Arms Raised Twist Flow": ["SEATED", "TWISTS"],
  "Standing Archer Pose": ["BALANCING_POSES", "STANDING_POSES"],
  "Shoulder Rolls Close Up": ["RESTORATIVE"],
  "Revolved Pigeon Pose": ["HIP_OPENERS", "TWISTS"],
  "Revolved Seated Straddle Pose Variation Forward Bend Flow": ["FORWARD_BENDS", "SEATED", "TWISTS"],
  "Horse Pose Side Stretch Hand On Floor": ["HIP_OPENERS", "STANDING_POSES"],
  "Bear Pose Arms Out": ["ARM_BALANCES"],
  "One Legged Mountain Pose Side Bend": ["BALANCING_POSES", "STANDING_POSES"],
  "Revolved High Lunge High Lunge Pose Variation Arms Behind Flow": ["LUNGES", "STANDING_POSES", "TWISTS"],
  "Horse Pose Flexed Wrists": ["HIP_OPENERS", "STANDING_POSES"],
  "Feathered Peacock Pose Prepation At Wall": ["ARM_BALANCES", "INVERSIONS"],
  "Side Lunge Forward Fold Pose Flow": ["FORWARD_BENDS", "STANDING_POSES"],
  "Revolved Half Bound Forward Fold Pose": ["FORWARD_BENDS", "STANDING_POSES", "TWISTS"],
  "Half Boat Pose Flow With Ball": ["ABDOMINALS"],
  "Elephant Pose": ["ARM_BALANCES"],
  "Revolved Standing Forward Fold Pose Both Hands To Feet": ["FORWARD_BENDS", "STANDING_POSES", "TWISTS"],
  "Turbo Dog Pose": ["INVERSIONS"],
  "Revolved Crescent Low Lunge Pose Hand Knee": ["LUNGES", "TWISTS"],
  "Mongoose Pose": ["HIP_OPENERS", "SEATED"],
  "Standing Side Lunge Pose Forward Bend Cow Face Arms": ["HIP_OPENERS", "STANDING_POSES"],
  "Brolga Pose": ["BALANCING_POSES", "STANDING_POSES"],
  "Head To Ankle Prep Pose": ["BALANCING_POSES", "FORWARD_BENDS"],
};

type PoseCategory = keyof typeof TUMMEE_CATEGORIES;

interface PoseEntry {
  name: string;
  sanskritName: string;
  categories?: string[];
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

// Build reverse lookup: normalized name → categories
const nameToCats = new Map<string, Set<string>>();
const allTummeeNames: Array<{ key: string; cat: string }> = [];

for (const [cat, poses] of Object.entries(TUMMEE_CATEGORIES)) {
  for (const pose of poses) {
    const key = normalize(pose);
    if (!nameToCats.has(key)) nameToCats.set(key, new Set());
    nameToCats.get(key)!.add(cat);
    allTummeeNames.push({ key, cat });
  }
}

function getCategoriesForPose(poseName: string): Set<string> {
  const key = normalize(poseName);

  // 1. Manual override
  const override = MANUAL_OVERRIDES[poseName];
  if (override) return new Set(override);

  // 2. Exact match
  const exact = nameToCats.get(key);
  if (exact) return exact;

  // 3. Partial match: a tummee name starts with this pose name
  //    e.g. "Plank Pose" matches "Plank Pose Knees Bent"
  const result = new Set<string>();
  for (const { key: tKey, cat } of allTummeeNames) {
    if (tKey.startsWith(key + " ") || key.startsWith(tKey + " ")) {
      result.add(cat);
    }
  }
  return result;
}

const filePath = path.join(__dirname, "forrest-poses.json");
const poses: PoseEntry[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

let matched = 0;
let unmatched = 0;

const updated = poses.map((pose) => {
  const cats = getCategoriesForPose(pose.name);
  if (cats.size > 0) {
    matched++;
    return { ...pose, categories: Array.from(cats).sort() };
  } else {
    unmatched++;
    return { ...pose, categories: [] };
  }
});

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + "\n");
console.log(`Done. Matched: ${matched}, Unmatched: ${unmatched}`);

// Print unmatched poses for manual review
const unmatchedPoses = updated.filter((p) => p.categories!.length === 0);
if (unmatchedPoses.length > 0) {
  console.log("\nUnmatched poses:");
  unmatchedPoses.forEach((p) => console.log(" -", p.name));
}
