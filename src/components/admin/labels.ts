// Human-readable labels for database values shown in the admin side.
// (Plain module, so both server pages and client forms can import these values.)

/** Follow-up stages, in order. */
export const STAGES = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["visited", "Visited"],
  ["attending", "Attending"],
  ["foundations", "Foundations class"],
  ["baptized", "Baptised"],
  ["cell_group", "In a cell group"],
  ["closed", "Closed"],
] as const;

export const EVENT_LABELS: Record<string, string> = {
  visit_planned: "Planned a visit",
  gave_life_to_jesus: "Gave their life to Jesus",
  rededicated: "Came back to Jesus",
  wants_water_baptism: "Wants water baptism",
  wants_holy_spirit_prayer: "Wants prayer for the Holy Spirit",
  has_questions: "Has questions about faith",
  contacted: "Contacted by the team",
  visited: "Visited",
  attended: "Attended a service",
  baptized_water: "Baptised in water",
  baptized_holy_spirit: "Baptised in the Holy Spirit",
  joined_cell_group: "Joined a cell group",
  note: "Note",
};

export const SOURCE_LABELS: Record<string, string> = {
  plan_a_visit: "Plan a Visit form",
  know_jesus: "Know Jesus page",
  street_outreach: "Street outreach",
  online: "Online",
  walk_in: "Walked in (check-in)",
};

export const PRAYER_CATEGORIES: Record<string, string> = {
  salvation: "Salvation",
  healing: "Healing",
  family: "Family & marriage",
  work_finances: "Work & finances",
  deliverance: "Deliverance",
  holy_spirit: "Holy Spirit",
  other: "Other",
};
