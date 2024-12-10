"use client";

import { useState } from "react";

const skills = [
    { id: 0, name: "", base: "" },
    { id: 1, name: "acrobatics", base: "dexterity" },
    { id: 2, name: "animal handling", base: "wisdom" },
    { id: 3, name: "arcana", base: "intelligence" },
    { id: 4, name: "athletics", base: "strength" },
    { id: 5, name: "deception", base: "charisma" },
    { id: 6, name: "history", base: "intelligence" },
    { id: 7, name: "insight", base: "wisdom" },
    { id: 8, name: "intimidation", base: "charisma" },
    { id: 9, name: "investigation", base: "intelligence" },
    { id: 10, name: "medicine", base: "wisdom" },
    { id: 11, name: "nature", base: "intelligence" },
    { id: 12, name: "perception", base: "wisdom" },
    { id: 13, name: "performance", base: "charisma" },
    { id: 14, name: "persuasion", base: "charisma" },
    { id: 15, name: "religion", base: "intelligence" },
    { id: 16, name: "sleight of hand", base: "dexterity" },
    { id: 17, name: "stealth", base: "dexterity" },
    { id: 18, name: "survival", base: "wisdom" },
];

type ClassType = {
    [key: number]: {
        className: string;
        hitDie: number;
        proficiencies: string[];
        savingThrows: string[];
        skillsNum: number;
        skills: { id: number; name: string; base: string }[];
        equipment: string[];
    };
};

type RaceType = {
	[key: number]: {
		className: string;
		abilityScores: { [key: string]: number };
		speed: number;
		traits: string[];
	};
};

const classes: ClassType = {
	0: {
        className: "Barbarian",
        hitDie: 12,
        proficiencies: [
            "light armor",
            "medium armor",
            "shields",
            "simple weapons",
            "martial weapons",
        ],
        savingThrows: ["strength", "constitution"],
        skillsNum: 2,
        skills: skills,
        equipment: [
            "greataxe",
            "any martial melee weapon",
            "two handaxes",
            "explorer's pack",
        ],
    },
};

const races = {
    Aarakocra: {
        abilityScores: { dexterity: 2, wisdom: 1 },
        speed: 25,
        traits: ["flight", "talons"],
    },
    Aasimar: {
        abilityScores: { charisma: 2 },
        speed: 30,
        traits: ["darkvision", "celestial resistance", "healing hands"],
    },
    Bugbear: {
        abilityScores: { strength: 2, dexterity: 1 },
        speed: 30,
        traits: ["darkvision", "long-limbed", "powerful build", "sneaky"],
    },
    Centaur: {
        abilityScores: { strength: 2, wisdom: 1 },
        speed: 40,
        traits: ["charge", "hooves"],
    },
    Changeling: {
        abilityScores: { charisma: 2 },
        speed: 30,
        traits: ["shapechanger", "duplicity", "unnatural"],
    },
    Dragonborn: {
        abilityScores: { strength: 2, charisma: 1 },
        speed: 30,
        traits: ["draconic ancestry", "breath weapon", "damage resistance"],
    },
    Dwarf: {
        abilityScores: { constitution: 2 },
        speed: 25,
        traits: [
            "darkvision",
            "dwarven resilience",
            "dwarven combat training",
            "stonecunning",
        ],
    },
    Elf: {
        abilityScores: { dexterity: 2 },
        speed: 30,
        traits: ["darkvision", "keen senses", "fey ancestry", "trance"],
    },
    Firbolg: {
        abilityScores: { wisdom: 2, strength: 1 },
        speed: 30,
        traits: [
            "fey ancestry",
            "giant kinship",
            "hidden step",
            "powerful build",
        ],
    },
    Genasi: {
        abilityScores: { constitution: 2 },
        speed: 30,
        traits: [
            "ability score increase",
            "elemental resistance",
            "reach to the blaze",
        ],
    },
    Gith: {
        abilityScores: { intelligence: 1 },
        speed: 30,
        traits: [
            "ability score increase",
            "darkvision",
            "martial prodigy",
            "githyanki psionics",
        ],
    },
    Gnome: {
        abilityScores: { intelligence: 2 },
        speed: 25,
        traits: [
            "darkvision",
            "gnome cunning",
            "natural illusionist",
            "artificer's lore",
        ],
    },
    Goblin: {
        abilityScores: { dexterity: 2, constitution: 1 },
        speed: 30,
        traits: ["darkvision", "fury of the small", "nimble escape"],
    },
    Goliath: {
        abilityScores: { strength: 2, constitution: 1 },
        speed: 30,
        traits: [
            "natural athlete",
            "stone's endurance",
            "powerful build",
            "mountain born",
        ],
    },
    Half_Elf: {
        abilityScores: { charisma: 2 },
        speed: 30,
        traits: ["darkvision", "fey ancestry", "skill versatility"],
    },
    Half_Orc: {
        abilityScores: { strength: 2, constitution: 1 },
        speed: 30,
        traits: [
            "darkvision",
            "menacing",
            "relentless endurance",
            "savage attacks",
        ],
    },
    Halfling: {
        abilityScores: { dexterity: 2 },
        speed: 25,
        traits: ["lucky", "brave", "halfling nimbleness"],
    },
    Hobgoblin: {
        abilityScores: { constitution: 2, intelligence: 1 },
        speed: 30,
        traits: ["darkvision", "martial training", "saving face"],
    },
    Human: {
        abilityScores: {
            strength: 1,
            dexterity: 1,
            constitution: 1,
            intelligence: 1,
            wisdom: 1,
            charisma: 1,
        },
        speed: 30,
        traits: ["ability score increase"],
    },
    Kalashtar: {
        abilityScores: { charisma: 1, wisdom: 1 },
        speed: 30,
        traits: ["ability score increase", "dual mind", "mental discipline"],
    },
    Kenku: {
        abilityScores: { dexterity: 2, wisdom: 1 },
        speed: 30,
        traits: ["expert forgery", "kenku training", "mimicry"],
    },
    Kobold: {
        abilityScores: { dexterity: 2, strength: -2 },
        speed: 30,
        traits: [
            "darkvision",
            "grovel, cower, and beg",
            "pack tactics",
            "sunlight sensitivity",
        ],
    },
    Lizardfolk: {
        abilityScores: { constitution: 2, wisdom: 1 },
        speed: 30,
        traits: [
            "bite",
            "cunning artisan",
            "hold breath",
            "natural armor",
            "hungry jaws",
        ],
    },
    Orc: {
        abilityScores: { strength: 2, constitution: 1 },
        speed: 30,
        traits: ["darkvision", "aggressive", "menacing", "powerful build"],
    },
    Shifter: {
        abilityScores: { dexterity: 1 },
        speed: 30,
        traits: ["ability score increase", "darkvision", "shifting"],
    },
    Tiefling: {
        abilityScores: { charisma: 2, intelligence: 1 },
        speed: 30,
        traits: ["darkvision", "hellish resistance", "infernal legacy"],
    },
    Tortle: {
        abilityScores: { strength: 2, wisdom: 1 },
        speed: 30,
        traits: ["claws", "hold breath", "natural armor", "shell defense"],
    },
    Triton: {
        abilityScores: { strength: 1, constitution: 1, charisma: 1 },
        speed: 30,
        traits: [
            "amphibious",
            "control air and water",
            "eelctroreception",
            "guardians of the depths",
        ],
    },
    Warforged: {
        abilityScores: { constitution: 1 },
        speed: 30,
        traits: [
            "ability score increase",
            "constructed resilience",
            "living construct",
            "warforged resilience",
        ],
    },
    Yuan_Ti_Pureblood: {
        abilityScores: { charisma: 2, intelligence: 1 },
		speed: 30,
        traits: [
            "darkvision",
            "innate spellcasting",
            "magic resistance",
            "poison immunity",
        ],
    },
};

export default function Home() {
    return (
        <section>
            <form action="">
                <div className="classWrapper">
                    <label htmlFor="class">
                        Class:
                        <select name="class" id="class">
   
                        </select>
                    </label>
                    <label htmlFor="skills">
                        Skills:
                        <select name="skills" id="skills">

						</select>
                    </label>
                </div>
                <label htmlFor="level">
                    Level:
                    <input type="number" name="level" id="level" />
                </label>
                <label htmlFor="race">
                    Race:
                    <input type="text" name="race" id="race" />
                </label>
                <button type="submit">Submit</button>
            </form>
            <div></div>
        </section>
    );
}
