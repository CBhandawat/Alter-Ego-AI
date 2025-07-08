export type Question = {
    id: string;
    text: string;
    trait: "EXTRAVERSION" | "NEUROTICISM" | "AGREEABLENESS" | "CONSCIENTIOUSNESS" | "OPENNESS";
    reverse: boolean;
};

export const questions: Question[] = [
    // Extraversion
    { id: "EXT1", text: "I am the life of the party", trait: "EXTRAVERSION", reverse: false },
    { id: "EXT2", text: "I don't talk a lot", trait: "EXTRAVERSION", reverse: true },
    { id: "EXT3", text: "I feel comfortable around people", trait: "EXTRAVERSION", reverse: false },
    { id: "EXT4", text: "I keep in the background", trait: "EXTRAVERSION", reverse: true },
    { id: "EXT5", text: "I start conversations", trait: "EXTRAVERSION", reverse: false },
    { id: "EXT6", text: "I have little to say", trait: "EXTRAVERSION", reverse: true },
    { id: "EXT7", text: "I talk to a lot of different people at parties", trait: "EXTRAVERSION", reverse: false },
    { id: "EXT8", text: "I don't like to draw attention to myself", trait: "EXTRAVERSION", reverse: true },
    { id: "EXT9", text: "I don't mind being the center of attention", trait: "EXTRAVERSION", reverse: false },
    { id: "EXT10", text: "I am quiet around strangers", trait: "EXTRAVERSION", reverse: true },

    // Neuroticism
    { id: "EST1", text: "I get stressed out easily", trait: "NEUROTICISM", reverse: false },
    { id: "EST2", text: "I am relaxed most of the time", trait: "NEUROTICISM", reverse: true },
    { id: "EST3", text: "I worry about things", trait: "NEUROTICISM", reverse: false },
    { id: "EST4", text: "I seldom feel blue", trait: "NEUROTICISM", reverse: true },
    { id: "EST5", text: "I am easily disturbed", trait: "NEUROTICISM", reverse: false },
    { id: "EST6", text: "I get upset easily", trait: "NEUROTICISM", reverse: false },
    { id: "EST7", text: "I change my mood a lot", trait: "NEUROTICISM", reverse: false },
    { id: "EST8", text: "I have frequent mood swings", trait: "NEUROTICISM", reverse: false },
    { id: "EST9", text: "I get irritated easily", trait: "NEUROTICISM", reverse: false },
    { id: "EST10", text: "I often feel blue", trait: "NEUROTICISM", reverse: false },

    // Agreeableness
    { id: "AGR1", text: "I feel little concern for others", trait: "AGREEABLENESS", reverse: true },
    { id: "AGR2", text: "I am interested in people", trait: "AGREEABLENESS", reverse: false },
    { id: "AGR3", text: "I insult people", trait: "AGREEABLENESS", reverse: true },
    { id: "AGR4", text: "I sympathize with others' feelings", trait: "AGREEABLENESS", reverse: false },
    { id: "AGR5", text: "I am not interested in other people's problems", trait: "AGREEABLENESS", reverse: true },
    { id: "AGR6", text: "I have a soft heart", trait: "AGREEABLENESS", reverse: false },
    { id: "AGR7", text: "I am not really interested in others", trait: "AGREEABLENESS", reverse: true },
    { id: "AGR8", text: "I take time out for others", trait: "AGREEABLENESS", reverse: false },
    { id: "AGR9", text: "I feel others' emotions", trait: "AGREEABLENESS", reverse: false },
    { id: "AGR10", text: "I make people feel at ease", trait: "AGREEABLENESS", reverse: false },

    // Conscientiousness
    { id: "CSN1", text: "I am always prepared", trait: "CONSCIENTIOUSNESS", reverse: false },
    { id: "CSN2", text: "I leave my belongings around", trait: "CONSCIENTIOUSNESS", reverse: true },
    { id: "CSN3", text: "I pay attention to details", trait: "CONSCIENTIOUSNESS", reverse: false },
    { id: "CSN4", text: "I make a mess of things", trait: "CONSCIENTIOUSNESS", reverse: true },
    { id: "CSN5", text: "I get chores done right away", trait: "CONSCIENTIOUSNESS", reverse: false },
    { id: "CSN6", text: "I often forget to put things back in their proper place", trait: "CONSCIENTIOUSNESS", reverse: true },
    { id: "CSN7", text: "I like order", trait: "CONSCIENTIOUSNESS", reverse: false },
    { id: "CSN8", text: "I shirk my duties", trait: "CONSCIENTIOUSNESS", reverse: true },
    { id: "CSN9", text: "I follow a schedule", trait: "CONSCIENTIOUSNESS", reverse: false },
    { id: "CSN10", text: "I am exacting in my work", trait: "CONSCIENTIOUSNESS", reverse: false },

    // Openness
    { id: "OPN1", text: "I have a rich vocabulary", trait: "OPENNESS", reverse: false },
    { id: "OPN2", text: "I have difficulty understanding abstract ideas", trait: "OPENNESS", reverse: true },
    { id: "OPN3", text: "I have a vivid imagination", trait: "OPENNESS", reverse: false },
    { id: "OPN4", text: "I am not interested in abstract ideas", trait: "OPENNESS", reverse: true },
    { id: "OPN5", text: "I have excellent ideas", trait: "OPENNESS", reverse: false },
    { id: "OPN6", text: "I do not have a good imagination", trait: "OPENNESS", reverse: true },
    { id: "OPN7", text: "I am quick to understand things", trait: "OPENNESS", reverse: false },
    { id: "OPN8", text: "I use difficult words", trait: "OPENNESS", reverse: false },
    { id: "OPN9", text: "I spend time reflecting on things", trait: "OPENNESS", reverse: false },
    { id: "OPN10", text: "I am full of ideas", trait: "OPENNESS", reverse: false },
];
