(() => {
    const defines = {};
    const entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies, factory };
        entry[0] = name;
    }
    define("require", ["exports"], (exports) => {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: (name) => resolve(name) });
    });
    var __importStar = (this && this.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };
    define("common", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        // 1 red
        // 2 blue
        // 4 green
        // 8 light
        // 16 dark
        // 32 heart
        // 64 jammer
        // 128 poison
        // 256 mortal poison
        // const COLOR_ORDER = 'rbgldhjpmou';
        const COLORS = [
            'r',
            'b',
            'g',
            'l',
            'd',
            'h',
            'j',
            'p',
            'm',
            'o',
            'u',
        ];
        exports.COLORS = COLORS;
        function idxsFromBits(bits) {
            const idxs = [];
            for (let idx = 0; bits >> idx; idx++) {
                if (bits >> idx & 1) {
                    idxs.push(idx);
                }
            }
            return idxs;
        }
        exports.idxsFromBits = idxsFromBits;
        var Attribute;
        (function (Attribute) {
            Attribute[Attribute["FIRE"] = 0] = "FIRE";
            Attribute[Attribute["WATER"] = 1] = "WATER";
            Attribute[Attribute["WOOD"] = 2] = "WOOD";
            Attribute[Attribute["LIGHT"] = 3] = "LIGHT";
            Attribute[Attribute["DARK"] = 4] = "DARK";
            Attribute[Attribute["HEART"] = 5] = "HEART";
            Attribute[Attribute["JAMMER"] = 6] = "JAMMER";
            Attribute[Attribute["POISON"] = 7] = "POISON";
            Attribute[Attribute["MORTAL_POISON"] = 8] = "MORTAL_POISON";
            Attribute[Attribute["BOMB"] = 9] = "BOMB";
            Attribute[Attribute["FIXED"] = -2] = "FIXED";
            Attribute[Attribute["NONE"] = -1] = "NONE";
        })(Attribute || (Attribute = {}));
        exports.Attribute = Attribute;
        const AttributeToName = new Map();
        exports.AttributeToName = AttributeToName;
        AttributeToName.set(Attribute.FIRE, 'Fire');
        AttributeToName.set(Attribute.WATER, 'Water');
        AttributeToName.set(Attribute.WOOD, 'Wood');
        AttributeToName.set(Attribute.LIGHT, 'Light');
        AttributeToName.set(Attribute.DARK, 'Dark');
        AttributeToName.set(Attribute.NONE, 'None');
        AttributeToName.set(Attribute.HEART, 'Heart');
        AttributeToName.set(Attribute.JAMMER, 'Jammer');
        AttributeToName.set(Attribute.POISON, 'Poison');
        AttributeToName.set(Attribute.MORTAL_POISON, 'Mortal Poison');
        var MonsterType;
        (function (MonsterType) {
            MonsterType[MonsterType["NONE"] = -1] = "NONE";
            MonsterType[MonsterType["EVO"] = 0] = "EVO";
            MonsterType[MonsterType["BALANCED"] = 1] = "BALANCED";
            MonsterType[MonsterType["PHYSICAL"] = 2] = "PHYSICAL";
            MonsterType[MonsterType["HEALER"] = 3] = "HEALER";
            MonsterType[MonsterType["DRAGON"] = 4] = "DRAGON";
            MonsterType[MonsterType["GOD"] = 5] = "GOD";
            MonsterType[MonsterType["ATTACKER"] = 6] = "ATTACKER";
            MonsterType[MonsterType["DEVIL"] = 7] = "DEVIL";
            MonsterType[MonsterType["MACHINE"] = 8] = "MACHINE";
            MonsterType[MonsterType["AWOKEN"] = 12] = "AWOKEN";
            MonsterType[MonsterType["ENHANCED"] = 14] = "ENHANCED";
            MonsterType[MonsterType["REDEEMABLE"] = 15] = "REDEEMABLE";
            MonsterType[MonsterType["UNKNOWN_1"] = 9] = "UNKNOWN_1";
            MonsterType[MonsterType["UNKNOWN_2"] = 10] = "UNKNOWN_2";
            MonsterType[MonsterType["UNKNOWN_3"] = 11] = "UNKNOWN_3";
            MonsterType[MonsterType["UNKNOWN_4"] = 13] = "UNKNOWN_4";
        })(MonsterType || (MonsterType = {}));
        exports.MonsterType = MonsterType;
        const TypeToName = new Map();
        exports.TypeToName = TypeToName;
        TypeToName.set(MonsterType.EVO, 'Evo');
        TypeToName.set(MonsterType.BALANCED, 'Balanced');
        TypeToName.set(MonsterType.PHYSICAL, 'Physical');
        TypeToName.set(MonsterType.HEALER, 'Healer');
        TypeToName.set(MonsterType.DRAGON, 'Dragon');
        TypeToName.set(MonsterType.GOD, 'God');
        TypeToName.set(MonsterType.ATTACKER, 'Attacker');
        TypeToName.set(MonsterType.DEVIL, 'Devil');
        TypeToName.set(MonsterType.MACHINE, 'Machine');
        TypeToName.set(MonsterType.AWOKEN, 'Awakening');
        TypeToName.set(MonsterType.ENHANCED, 'Enhanced');
        TypeToName.set(MonsterType.REDEEMABLE, 'Redeemable');
        TypeToName.set(MonsterType.NONE, 'None');
        var Latent;
        (function (Latent) {
            Latent[Latent["HP"] = 0] = "HP";
            Latent[Latent["ATK"] = 1] = "ATK";
            Latent[Latent["RCV"] = 2] = "RCV";
            Latent[Latent["TIME"] = 3] = "TIME";
            Latent[Latent["AUTOHEAL"] = 4] = "AUTOHEAL";
            Latent[Latent["RESIST_FIRE"] = 5] = "RESIST_FIRE";
            Latent[Latent["RESIST_WATER"] = 6] = "RESIST_WATER";
            Latent[Latent["RESIST_WOOD"] = 7] = "RESIST_WOOD";
            Latent[Latent["RESIST_LIGHT"] = 8] = "RESIST_LIGHT";
            Latent[Latent["RESIST_DARK"] = 9] = "RESIST_DARK";
            Latent[Latent["SDR"] = 10] = "SDR";
            Latent[Latent["ALL_STATS"] = 11] = "ALL_STATS";
            Latent[Latent["EVO"] = 12] = "EVO";
            Latent[Latent["AWOKEN"] = 13] = "AWOKEN";
            Latent[Latent["ENHANCED"] = 14] = "ENHANCED";
            Latent[Latent["REDEEMABLE"] = 15] = "REDEEMABLE";
            Latent[Latent["GOD"] = 16] = "GOD";
            Latent[Latent["DRAGON"] = 17] = "DRAGON";
            Latent[Latent["DEVIL"] = 18] = "DEVIL";
            Latent[Latent["MACHINE"] = 19] = "MACHINE";
            Latent[Latent["BALANCED"] = 20] = "BALANCED";
            Latent[Latent["ATTACKER"] = 21] = "ATTACKER";
            Latent[Latent["PHYSICAL"] = 22] = "PHYSICAL";
            Latent[Latent["HEALER"] = 23] = "HEALER";
            Latent[Latent["HP_PLUS"] = 24] = "HP_PLUS";
            Latent[Latent["ATK_PLUS"] = 25] = "ATK_PLUS";
            Latent[Latent["RCV_PLUS"] = 26] = "RCV_PLUS";
            Latent[Latent["TIME_PLUS"] = 27] = "TIME_PLUS";
            Latent[Latent["RESIST_FIRE_PLUS"] = 28] = "RESIST_FIRE_PLUS";
            Latent[Latent["RESIST_WATER_PLUS"] = 29] = "RESIST_WATER_PLUS";
            Latent[Latent["RESIST_WOOD_PLUS"] = 30] = "RESIST_WOOD_PLUS";
            Latent[Latent["RESIST_LIGHT_PLUS"] = 31] = "RESIST_LIGHT_PLUS";
            Latent[Latent["RESIST_DARK_PLUS"] = 32] = "RESIST_DARK_PLUS";
            Latent[Latent["RESIST_ATTRIBUTE_ABSORB"] = 33] = "RESIST_ATTRIBUTE_ABSORB";
            Latent[Latent["RESIST_DAMAGE_VOID"] = 34] = "RESIST_DAMAGE_VOID";
            Latent[Latent["RESIST_POISON_SKYFALL"] = 35] = "RESIST_POISON_SKYFALL";
            Latent[Latent["RESIST_JAMMER_SKYFALL"] = 36] = "RESIST_JAMMER_SKYFALL";
            Latent[Latent["RESIST_LEADER_SWAP"] = 37] = "RESIST_LEADER_SWAP";
        })(Latent || (Latent = {}));
        exports.Latent = Latent;
        var Awakening;
        (function (Awakening) {
            Awakening[Awakening["HP"] = 1] = "HP";
            Awakening[Awakening["ATK"] = 2] = "ATK";
            Awakening[Awakening["RCV"] = 3] = "RCV";
            Awakening[Awakening["RESIST_FIRE"] = 4] = "RESIST_FIRE";
            Awakening[Awakening["RESIST_WATER"] = 5] = "RESIST_WATER";
            Awakening[Awakening["RESIST_WOOD"] = 6] = "RESIST_WOOD";
            Awakening[Awakening["RESIST_LIGHT"] = 7] = "RESIST_LIGHT";
            Awakening[Awakening["RESIST_DARK"] = 8] = "RESIST_DARK";
            Awakening[Awakening["AUTOHEAL"] = 9] = "AUTOHEAL";
            Awakening[Awakening["RESIST_BIND"] = 10] = "RESIST_BIND";
            Awakening[Awakening["RESIST_BLIND"] = 11] = "RESIST_BLIND";
            Awakening[Awakening["RESIST_JAMMER"] = 12] = "RESIST_JAMMER";
            Awakening[Awakening["RESIST_POISON"] = 13] = "RESIST_POISON";
            Awakening[Awakening["OE_FIRE"] = 14] = "OE_FIRE";
            Awakening[Awakening["OE_WATER"] = 15] = "OE_WATER";
            Awakening[Awakening["OE_WOOD"] = 16] = "OE_WOOD";
            Awakening[Awakening["OE_LIGHT"] = 17] = "OE_LIGHT";
            Awakening[Awakening["OE_DARK"] = 18] = "OE_DARK";
            Awakening[Awakening["TIME"] = 19] = "TIME";
            Awakening[Awakening["RECOVER_BIND"] = 20] = "RECOVER_BIND";
            Awakening[Awakening["SKILL_BOOST"] = 21] = "SKILL_BOOST";
            Awakening[Awakening["ROW_FIRE"] = 22] = "ROW_FIRE";
            Awakening[Awakening["ROW_WATER"] = 23] = "ROW_WATER";
            Awakening[Awakening["ROW_WOOD"] = 24] = "ROW_WOOD";
            Awakening[Awakening["ROW_LIGHT"] = 25] = "ROW_LIGHT";
            Awakening[Awakening["ROW_DARK"] = 26] = "ROW_DARK";
            Awakening[Awakening["TPA"] = 27] = "TPA";
            Awakening[Awakening["SBR"] = 28] = "SBR";
            Awakening[Awakening["OE_HEART"] = 29] = "OE_HEART";
            Awakening[Awakening["MULTIBOOST"] = 30] = "MULTIBOOST";
            Awakening[Awakening["DRAGON"] = 31] = "DRAGON";
            Awakening[Awakening["GOD"] = 32] = "GOD";
            Awakening[Awakening["DEVIL"] = 33] = "DEVIL";
            Awakening[Awakening["MACHINE"] = 34] = "MACHINE";
            Awakening[Awakening["BALANCED"] = 35] = "BALANCED";
            Awakening[Awakening["ATTACKER"] = 36] = "ATTACKER";
            Awakening[Awakening["PHYSICAL"] = 37] = "PHYSICAL";
            Awakening[Awakening["HEALER"] = 38] = "HEALER";
            Awakening[Awakening["EVO"] = 39] = "EVO";
            Awakening[Awakening["AWOKEN"] = 40] = "AWOKEN";
            Awakening[Awakening["ENHANCED"] = 41] = "ENHANCED";
            Awakening[Awakening["REDEEMABLE"] = 42] = "REDEEMABLE";
            Awakening[Awakening["COMBO_7"] = 43] = "COMBO_7";
            Awakening[Awakening["GUARD_BREAK"] = 44] = "GUARD_BREAK";
            Awakening[Awakening["BONUS_ATTACK"] = 45] = "BONUS_ATTACK";
            Awakening[Awakening["TEAM_HP"] = 46] = "TEAM_HP";
            Awakening[Awakening["TEAM_RCV"] = 47] = "TEAM_RCV";
            Awakening[Awakening["VDP"] = 48] = "VDP";
            Awakening[Awakening["AWOKEN_ASSIST"] = 49] = "AWOKEN_ASSIST";
            Awakening[Awakening["BONUS_ATTACK_SUPER"] = 50] = "BONUS_ATTACK_SUPER";
            Awakening[Awakening["SKILL_CHARGE"] = 51] = "SKILL_CHARGE";
            Awakening[Awakening["RESIST_BIND_PLUS"] = 52] = "RESIST_BIND_PLUS";
            Awakening[Awakening["TIME_PLUS"] = 53] = "TIME_PLUS";
            Awakening[Awakening["RESIST_CLOUD"] = 54] = "RESIST_CLOUD";
            Awakening[Awakening["RESIST_TAPE"] = 55] = "RESIST_TAPE";
            Awakening[Awakening["SKILL_BOOST_PLUS"] = 56] = "SKILL_BOOST_PLUS";
            Awakening[Awakening["HP_GREATER"] = 57] = "HP_GREATER";
            Awakening[Awakening["HP_LESSER"] = 58] = "HP_LESSER";
            Awakening[Awakening["L_GUARD"] = 59] = "L_GUARD";
            Awakening[Awakening["L_UNLOCK"] = 60] = "L_UNLOCK";
            Awakening[Awakening["COMBO_10"] = 61] = "COMBO_10";
            Awakening[Awakening["COMBO_ORB"] = 62] = "COMBO_ORB";
            Awakening[Awakening["VOICE"] = 63] = "VOICE";
            Awakening[Awakening["SOLOBOOST"] = 64] = "SOLOBOOST";
            Awakening[Awakening["HP_MINUS"] = 65] = "HP_MINUS";
            Awakening[Awakening["ATK_MINUS"] = 66] = "ATK_MINUS";
            Awakening[Awakening["RCV_MINUS"] = 67] = "RCV_MINUS";
            Awakening[Awakening["RESIST_BLIND_PLUS"] = 68] = "RESIST_BLIND_PLUS";
            Awakening[Awakening["RESIST_JAMMER_PLUS"] = 69] = "RESIST_JAMMER_PLUS";
            Awakening[Awakening["RESIST_POISON_PLUS"] = 70] = "RESIST_POISON_PLUS";
            Awakening[Awakening["JAMMER_BOOST"] = 71] = "JAMMER_BOOST";
            Awakening[Awakening["POISON_BOOST"] = 72] = "POISON_BOOST";
        })(Awakening || (Awakening = {}));
        exports.Awakening = Awakening;
        const AwakeningToPlus = new Map([
            [Awakening.SKILL_BOOST, { awakening: Awakening.SKILL_BOOST_PLUS, multiplier: 2 }],
            [Awakening.TIME, { awakening: Awakening.TIME_PLUS, multiplier: 2 }],
            [Awakening.RESIST_BIND, { awakening: Awakening.RESIST_BIND_PLUS, multiplier: 2 }],
            [Awakening.RESIST_POISON, { awakening: Awakening.RESIST_POISON_PLUS, multiplier: 5 }],
            [Awakening.RESIST_JAMMER, { awakening: Awakening.RESIST_JAMMER_PLUS, multiplier: 5 }],
            [Awakening.RESIST_BLIND, { awakening: Awakening.RESIST_BLIND_PLUS, multiplier: 5 }],
        ]);
        exports.AwakeningToPlus = AwakeningToPlus;
        const TypeToKiller = {
            0: Awakening.EVO,
            1: Awakening.BALANCED,
            2: Awakening.PHYSICAL,
            3: Awakening.HEALER,
            4: Awakening.DRAGON,
            5: Awakening.GOD,
            6: Awakening.ATTACKER,
            7: Awakening.DEVIL,
            8: Awakening.MACHINE,
            12: Awakening.AWOKEN,
            14: Awakening.ENHANCED,
            15: Awakening.REDEEMABLE,
            // Unset values.
            '-1': Awakening.AUTOHEAL,
            9: Awakening.AUTOHEAL,
            10: Awakening.AUTOHEAL,
            11: Awakening.AUTOHEAL,
            13: Awakening.AUTOHEAL,
        };
        exports.TypeToKiller = TypeToKiller;
        const TypeToLatentKiller = {
            0: Latent.EVO,
            1: Latent.BALANCED,
            2: Latent.PHYSICAL,
            3: Latent.HEALER,
            4: Latent.DRAGON,
            5: Latent.GOD,
            6: Latent.ATTACKER,
            7: Latent.DEVIL,
            8: Latent.MACHINE,
            12: Latent.AWOKEN,
            14: Latent.ENHANCED,
            15: Latent.REDEEMABLE,
            // Unset values.
            '-1': Latent.AUTOHEAL,
            9: Latent.AUTOHEAL,
            10: Latent.AUTOHEAL,
            11: Latent.AUTOHEAL,
            13: Latent.AUTOHEAL,
        };
        exports.TypeToLatentKiller = TypeToLatentKiller;
        const AwakeningToPlusAwakening = new Map([
            [Awakening.SKILL_BOOST, Awakening.SKILL_BOOST_PLUS],
            [Awakening.TIME, Awakening.TIME_PLUS],
            [Awakening.RESIST_BIND, Awakening.RESIST_BIND_PLUS],
            [Awakening.RESIST_BLIND, Awakening.RESIST_BLIND_PLUS],
            [Awakening.RESIST_POISON, Awakening.RESIST_POISON_PLUS],
            [Awakening.RESIST_JAMMER, Awakening.RESIST_JAMMER_PLUS],
        ]);
        exports.AwakeningToPlusAwakening = AwakeningToPlusAwakening;
        const PlusAwakeningMultiplier = new Map();
        exports.PlusAwakeningMultiplier = PlusAwakeningMultiplier;
        PlusAwakeningMultiplier.set(Awakening.SKILL_BOOST_PLUS, 2);
        PlusAwakeningMultiplier.set(Awakening.TIME_PLUS, 2);
        PlusAwakeningMultiplier.set(Awakening.RESIST_BIND_PLUS, 2);
        PlusAwakeningMultiplier.set(Awakening.RESIST_BLIND_PLUS, 5);
        PlusAwakeningMultiplier.set(Awakening.RESIST_JAMMER_PLUS, 5);
        PlusAwakeningMultiplier.set(Awakening.RESIST_POISON_PLUS, 5);
        const AwakeningToName = [
            'NULL',
            'HP', 'ATK', 'RCV', 'Resist Fire', 'Resist Water', 'Resist Wood', 'Resist Light', 'Resist Dark',
            'Autoheal', 'Resist Bind', 'Resist Blind', 'Resist Jammer', 'Resist Poison',
            'Fire OE', 'Water OE', 'Wood OE', 'Light OE', 'Dark OE',
            'Time',
            'Recover Bind',
            'Skill Boost',
            'Fire Row', 'Water Row', 'Wood Row', 'Light Row', 'Dark Row',
            'TPA', 'Skill-Bind Resist', 'Heart OE', 'Multiboost',
            'Dragon Killer', 'God Killer', 'Devil Killer', 'Machine Killer',
            'Balanced Killer', 'Attacker Killer', 'Physical Killer', 'Healer Killer',
            'Evo Killer', 'Awakening Killer', 'Enhanced Killer', 'Redeemable Killer',
            'Enhanced Combo', 'Guard Break', 'Bonus Attack', 'Team HP+', 'Team RCV+',
            'Damage Void Piercer', 'Awoken Assist', 'Super Bonus Attack', 'Skill Charge',
            'Resist Bind+', 'Time+', 'Resist Cloud', 'Resist Immobility', 'Skill Boost+',
            '>=80% Enhace', '<=50% Enhance', 'L-Guard', 'L-Unlock', 'Enhanced Combo+',
            'Combo Orb', 'Voice', 'Soloboost', 'HP-', 'ATK-', 'RCV-',
            'Resist Blind+', 'Resist Poison+', 'Resist Jammer+',
            'Jammer Blessing', 'Poison Blessing',
        ];
        exports.AwakeningToName = AwakeningToName;
        const Round = {
            UP: Math.ceil,
            DOWN: Math.floor,
            NEAREST: Math.round,
            NONE: (a) => a,
        };
        exports.Round = Round;
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        exports.numberWithCommas = numberWithCommas;
        const LatentSuper = new Set([
            Latent.EVO, Latent.AWOKEN, Latent.ENHANCED, Latent.REDEEMABLE,
            Latent.GOD, Latent.DRAGON, Latent.DEVIL, Latent.MACHINE,
            Latent.BALANCED, Latent.ATTACKER, Latent.PHYSICAL, Latent.HEALER,
            Latent.ALL_STATS, Latent.HP_PLUS, Latent.ATK_PLUS,
            Latent.RCV_PLUS, Latent.TIME_PLUS,
            Latent.RESIST_FIRE_PLUS, Latent.RESIST_WATER_PLUS, Latent.RESIST_WOOD_PLUS,
            Latent.RESIST_LIGHT_PLUS, Latent.RESIST_DARK_PLUS,
        ]);
        exports.LatentSuper = LatentSuper;
        var Shape;
        (function (Shape) {
            Shape[Shape["AMORPHOUS"] = 0] = "AMORPHOUS";
            Shape[Shape["L"] = 1] = "L";
            Shape[Shape["COLUMN"] = 2] = "COLUMN";
            Shape[Shape["CROSS"] = 3] = "CROSS";
            Shape[Shape["BOX"] = 4] = "BOX";
            Shape[Shape["ROW"] = 5] = "ROW";
        })(Shape || (Shape = {}));
        exports.Shape = Shape;
        const LetterToShape = {
            'A': Shape.AMORPHOUS,
            'L': Shape.L,
            'C': Shape.COLUMN,
            'X': Shape.CROSS,
            'B': Shape.BOX,
            'R': Shape.ROW,
        };
        exports.LetterToShape = LetterToShape;
        const ShapeToLetter = {
            0: 'A',
            1: 'L',
            2: 'C',
            3: 'X',
            4: 'B',
            5: 'R',
        };
        exports.ShapeToLetter = ShapeToLetter;
        const BASE_URL = window.origin + window.location.pathname;
        exports.BASE_URL = BASE_URL;
        async function waitFor(conditionFn, waitMs = 50) {
            while (!conditionFn()) {
                await new Promise((resolve) => setTimeout(resolve, waitMs));
            }
        }
        exports.waitFor = waitFor;
        var FontColor;
        (function (FontColor) {
            FontColor["FIRE"] = "red";
            FontColor["WATER"] = "cyan";
            FontColor["WOOD"] = "lawngreen";
            FontColor["LIGHT"] = "yellow";
            FontColor["DARK"] = "fuchsia";
            FontColor["HEART"] = "pink";
            FontColor["JAMMER"] = "lightgray";
            FontColor["POISON"] = "purple";
            FontColor["MORTAL_POISON"] = "darkpurple";
            FontColor["BOMB"] = "brown";
            FontColor["COLORLESS"] = "gray";
            FontColor["FIXED"] = "white";
            FontColor["NONE"] = "black";
        })(FontColor || (FontColor = {}));
        exports.FontColor = FontColor;
        const AttributeToFontColor = {
            0: FontColor.FIRE,
            1: FontColor.WATER,
            2: FontColor.WOOD,
            3: FontColor.LIGHT,
            4: FontColor.DARK,
            5: FontColor.HEART,
            6: FontColor.JAMMER,
            7: FontColor.POISON,
            8: FontColor.MORTAL_POISON,
            9: FontColor.BOMB,
            '-2': FontColor.FIXED,
            '-1': FontColor.NONE,
        };
        exports.AttributeToFontColor = AttributeToFontColor;
        // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        function addCommas(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // let decimalPart = '';
            // if (!Number.isInteger(n)) {
            //   let fn = Math.floor;
            //   if (n < 0) {
            //     fn = Math.ceil;
            //   }
            //   decimalPart = String(n - fn(n)).substring(1, 2 + maxPrecision);
            //   while (decimalPart[decimalPart.length - 1] == '0') {
            //     decimalPart = decimalPart.substring(0, decimalPart.length - 1);
            //   }
            //   n = fn(n);
            // }
            // const reversed = String(n).split('').reverse().join('');
            // const forwardCommaArray = reversed.replace(/(\d\d\d)/g, '$1,').split('').reverse();
            // if (forwardCommaArray[0] == ',') {
            //   forwardCommaArray.splice(0, 1);
            // } else if (forwardCommaArray[0] == '-' && forwardCommaArray[1] == ',') {
            //   forwardCommaArray.splice(1, 1);
            // }
            // return forwardCommaArray.join('') + decimalPart;
        }
        exports.addCommas = addCommas;
        function removeCommas(s) {
            return Number(s.replace(/,/g, ''));
        }
        exports.removeCommas = removeCommas;
        class Rational {
            constructor(numerator = 0, denominator = 1) {
                this.numerator = 0;
                this.denominator = 1;
                this.numerator = numerator;
                this.denominator = denominator;
            }
            multiply(n, roundingFn = (x) => x) {
                return roundingFn(n * this.numerator / this.denominator);
            }
            reduce() {
                // Cannot reduce if denominator already 1
                if (this.denominator == 1) {
                    return;
                }
                // Can only reduce integral pairs.
                if (!Number.isInteger(this.numerator) || !Number.isInteger(this.denominator)) {
                    return;
                }
                function divides(num, den) {
                    return Number.isInteger(num / den);
                }
                function gcd(a, b) {
                    while (!divides(a, b) && !divides(b, a)) {
                        if (a > b) {
                            a -= b;
                        }
                        else {
                            b -= a;
                        }
                    }
                    return Math.min(a, b);
                }
                const divisor = gcd(this.numerator, this.denominator);
                if (divisor == 1) {
                    return;
                }
                this.numerator /= divisor;
                this.denominator /= divisor;
            }
            toString() {
                this.reduce();
                if (this.denominator == 1) {
                    return String(this.numerator);
                }
                return `${this.numerator} / ${this.denominator}`;
            }
            static from(s) {
                if (!s.includes('/')) {
                    return new Rational(Number(s));
                }
                let match = s.match(Rational.matcher);
                if (match && match[0] == s) {
                    return new Rational(Number(match[1]), Number(match[2]));
                }
                return new Rational(NaN);
            }
        }
        exports.Rational = Rational;
        Rational.matcher = /\s*(-?\d+)\s*\/\s*(\d+)\s*/;
        const INT_CAP = 2 ** 31 - 1;
        exports.INT_CAP = INT_CAP;
        var TeamBadge;
        (function (TeamBadge) {
            TeamBadge[TeamBadge["NONE"] = 0] = "NONE";
            TeamBadge[TeamBadge["COST"] = 1] = "COST";
            TeamBadge[TeamBadge["TIME"] = 2] = "TIME";
            TeamBadge[TeamBadge["MASS_ATTACK"] = 3] = "MASS_ATTACK";
            TeamBadge[TeamBadge["RCV"] = 4] = "RCV";
            TeamBadge[TeamBadge["HP"] = 5] = "HP";
            TeamBadge[TeamBadge["ATK"] = 6] = "ATK";
            TeamBadge[TeamBadge["SKILL_BOOST"] = 7] = "SKILL_BOOST";
            TeamBadge[TeamBadge["RESIST_BIND"] = 8] = "RESIST_BIND";
            TeamBadge[TeamBadge["SBR"] = 9] = "SBR";
            TeamBadge[TeamBadge["EXP"] = 10] = "EXP";
            TeamBadge[TeamBadge["NO_SKYFALL"] = 11] = "NO_SKYFALL";
            TeamBadge[TeamBadge["RESIST_BLIND"] = 12] = "RESIST_BLIND";
            TeamBadge[TeamBadge["RESIST_JAMMER"] = 13] = "RESIST_JAMMER";
            TeamBadge[TeamBadge["RESIST_POISON"] = 14] = "RESIST_POISON";
            TeamBadge[TeamBadge["RCV_PLUS"] = 17] = "RCV_PLUS";
            TeamBadge[TeamBadge["HP_PLUS"] = 18] = "HP_PLUS";
            TeamBadge[TeamBadge["ATK_PLUS"] = 19] = "ATK_PLUS";
            TeamBadge[TeamBadge["TIME_PLUS"] = 21] = "TIME_PLUS";
        })(TeamBadge || (TeamBadge = {}));
        exports.TeamBadge = TeamBadge;
        const TeamBadgeToName = {
            0: 'None',
            1: 'Cost',
            2: 'Time Extend',
            3: 'Mass Attack',
            4: 'RCV',
            5: "HP",
            6: 'ATK',
            7: 'Skill Boost',
            8: 'Bind Immune',
            9: 'Skill-Bind Resist',
            11: 'No-Skyfall',
            17: 'RCV+',
            18: 'HP+',
            19: 'ATK+',
            21: 'Time Extend+',
            12: 'Blind Resist',
            13: 'Jammer Resist',
            14: 'Poison Resist',
            10: 'Rank Exp',
        };
        exports.TeamBadgeToName = TeamBadgeToName;
        const TEAM_BADGE_ORDER = [
            TeamBadge.NONE,
            TeamBadge.COST,
            TeamBadge.MASS_ATTACK,
            TeamBadge.RCV,
            TeamBadge.HP,
            TeamBadge.ATK,
            TeamBadge.SKILL_BOOST,
            TeamBadge.RESIST_BIND,
            TeamBadge.SBR,
            TeamBadge.NO_SKYFALL,
            TeamBadge.RCV_PLUS,
            TeamBadge.HP_PLUS,
            TeamBadge.ATK_PLUS,
            TeamBadge.TIME_PLUS,
            TeamBadge.RESIST_BLIND,
            TeamBadge.RESIST_JAMMER,
            TeamBadge.RESIST_POISON,
            TeamBadge.EXP,
        ];
        exports.TEAM_BADGE_ORDER = TEAM_BADGE_ORDER;
        const TeamBadgeToAwakening = new Map([
            [TeamBadge.TIME, { awakening: Awakening.TIME, count: 2 }],
            [TeamBadge.SKILL_BOOST, { awakening: Awakening.SKILL_BOOST, count: 1 }],
            [TeamBadge.RESIST_BIND, { awakening: Awakening.RESIST_BIND, count: 2 }],
            [TeamBadge.SBR, { awakening: Awakening.SBR, count: 2.5 }],
            [TeamBadge.TIME_PLUS, { awakening: Awakening.TIME, count: 4 }],
            [TeamBadge.RESIST_BLIND, { awakening: Awakening.RESIST_BLIND, count: 2.5 }],
            [TeamBadge.RESIST_JAMMER, { awakening: Awakening.RESIST_JAMMER, count: 2.5 }],
            [TeamBadge.RESIST_POISON, { awakening: Awakening.RESIST_POISON, count: 2.5 }],
        ]);
        exports.TeamBadgeToAwakening = TeamBadgeToAwakening;
        var BoolSetting;
        (function (BoolSetting) {
            BoolSetting["APRIL_FOOLS"] = "aprilFools";
            BoolSetting["INHERIT_PLUSSED"] = "inheritPlussed";
            BoolSetting["RESET_STATE"] = "resetStateOnEnemyLoad";
            BoolSetting["USE_PREEMPT"] = "usePreempt";
            BoolSetting["WARN_CLOSE"] = "warnOnClose";
            BoolSetting["WARN_CHANGE"] = "warnOnChange";
            BoolSetting["DEBUG_AREA"] = "debugArea";
            BoolSetting["SHOW_COOP_PARTNER"] = "showCoopPartner";
        })(BoolSetting || (BoolSetting = {}));
        exports.BoolSetting = BoolSetting;
        var NumberSetting;
        (function (NumberSetting) {
            NumberSetting["MONSTER_LEVEL"] = "monsterLevel";
            NumberSetting["INHERIT_LEVEL"] = "inheritLevel";
        })(NumberSetting || (NumberSetting = {}));
        exports.NumberSetting = NumberSetting;
    });
    /**
     * Simpler ajax function so that jQuery isn't necessary.  Only things required
     * are the url and optionally a done and fail function.
     * Meant to replace $.ajax({url: string}).
     */
    define("ajax", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        // References: https://www.sitepoint.com/guide-vanilla-ajax-without-jquery/
        function ajax(url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.send(null);
            let doneFn = (data) => console.log(data);
            let failFn = (msg) => console.error(msg);
            xhr.onreadystatechange = () => {
                const DONE = 4; // readyState 4 means the request is done.
                const OK = 200; // status 200 is a successful return.
                if (xhr.readyState === DONE) {
                    if (xhr.status === OK) {
                        doneFn(xhr.responseText);
                    }
                    else {
                        failFn('Error: ' + xhr.status);
                    }
                }
            };
            return {
                done: (fn) => {
                    doneFn = fn;
                },
                fail: (fn) => {
                    failFn = fn;
                },
            };
        }
        exports.ajax = ajax;
    });
    define("ilmina_stripped", ["require", "exports", "ajax", "common"], function (require, exports, ajax_1, common_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const AUGMENT_JP = Boolean(window.localStorage.augmentJp);
        // TODO: Add more.
        const LOADING_TEXTS = [
            'Fluffing the Floof',
            'Getting Grimoires Grimy',
            'Ransacking the Library',
            'Tossing Fluff Around',
            'Whispering Obscene Texts',
            'This Should Be Fun',
            'Liberating the Librarian',
            'Openly Discussing Data',
            'Arguing with the Keeper',
            'Instructing the Phantom',
            'Looking for Romia',
            'Definitely not PDC',
            'Throwing Shade on the Grimore',
            'Coloring the Books',
            'Boosting Ilmina\'s Skills',
            'Extending Time to Move',
            'Translating JP to NA',
            'Screw the Rules, I have Stones',
            'Suffocating in Cuddliness',
            'Talking to Itself',
            'Making an Album',
            'Calling Chaotically',
            'Calming Zuoh',
            'Ignoring Ilm',
            'Placating the Plushie',
            'Meow',
            'Romia x Ilmina',
            'Validating the Values',
            'Instructing the Slopes',
            'Playing Principal',
        ];
        function compress(s) {
            return LZUTF8.compress(s, { outputEncoding: 'StorageBinaryString' });
        }
        exports.compress = compress;
        function decompress(s) {
            return LZUTF8.decompress(s, { inputEncoding: 'StorageBinaryString' });
        }
        exports.decompress = decompress;
        class CardAssets {
            static isAlt(card) {
                return card.id > 10000;
            }
            static getAltBaseId(card) {
                return card.id % 100000;
            }
            static getCroppedPortrait(card) {
                let id = (card.id % 100000) + '';
                while (id.length < 5) {
                    id = '0' + id;
                }
                //return CardAssets.baseUrl + "extract/mons/MONS_" + id + ".PNG";
                return "https://ilmina.com/extract/mons/MONS_" + id + ".PNG";
            }
            static getUncroppedPortrait(card) {
                let id = (card.id % 100000) + '';
                while (id.length < 5) {
                    id = '0' + id;
                }
                return "https://ilmina.com/extract/mons2/MONS_" + id + ".PNG";
            }
            static getIconImageData(card) {
                const idIndex = card.id - 1;
                const idSet = Math.floor(idIndex / 100) + 1;
                const idSetStr = "000" + idSet;
                const idSetFinal = idSetStr.substr(-3, 3);
                const fileName = "CARDS_" + idSetFinal + ".PNG";
                let url = CardAssets.baseUrl + "extract/cards2/" + fileName;
                if (DataSource.isAprilFools()) {
                    url = CardAssets.baseUrl + "extract/cards3/" + fileName;
                }
                const ret = new GraphicDescription(url, 0, 0, 102, 102);
                const iconOffsetInSet = idIndex % 100;
                ret.offsetX = (iconOffsetInSet % 10) * ret.width;
                ret.offsetY = Math.floor(iconOffsetInSet / 10) * ret.height;
                ret.baseHeight = 1024;
                ret.baseWidth = 1024;
                return ret;
            }
            static getTypeImageData(cardType) {
                const row = 7 + Math.floor(cardType / 13);
                const column = cardType % 13;
                const url = 'assets/eggs.png'; // CardAssets.baseUrl + "custom/eggs.png";
                const ret = new GraphicDescription(url, 0, 0, 36, 36, 480, 612);
                ret.offsetY += row * 36;
                ret.offsetX += column * 36;
                return ret;
            }
            static canPlus(card) {
                if (card.types.indexOf(CardType.Evo) > -1) {
                    return false;
                }
                if (card.types.indexOf(CardType.Awakening) > -1) {
                    return false;
                }
                if (card.types.indexOf(CardType.Enhance) > -1 && card.maxLevel == 1) {
                    return false;
                }
                return true;
            }
        }
        exports.CardAssets = CardAssets;
        CardAssets.baseUrl = "https://f000.backblazeb2.com/file/ilmina/";
        CardAssets.apkVersion = "PAD_16.0.0.apk";
        /*
            This class is for Card related assets that are only on the UI and not really part of the card itself.
            For example Awakenings are really part of Cards while the "Skill" icon and background are not.
        */
        class CardUiAssets {
            static tryAddApkMetadata(asset, model) {
                if (!model) {
                    return false;
                }
                const apkMetadata = model.apkMetadata;
                if (!apkMetadata) {
                    return false;
                }
                let fileName = asset.url;
                if (!fileName) {
                    return false;
                }
                const expectedStart = CardAssets.baseUrl + "extract/" + CardAssets.apkVersion + "2/";
                if (fileName.indexOf(expectedStart) != 0) {
                    console.error("Url " + fileName + " does not support metadata");
                    return false;
                }
                fileName = fileName.substr(expectedStart.length);
                const assetMetadata = apkMetadata[fileName];
                if (!assetMetadata) {
                    return false;
                }
                asset.baseHeight = assetMetadata.height;
                asset.baseWidth = assetMetadata.width;
                return true;
            }
            static getIconBackground(model) {
                const url = CardAssets.baseUrl + "extract/" + CardAssets.apkVersion + "2/CARDFRAME.PNG";
                const ret = new GraphicDescription(url, 0, 104, 102, 102);
                CardUiAssets.tryAddApkMetadata(ret, model);
                return ret;
            }
            static getIconFrame(color, isSubAttribute, model) {
                const url = CardAssets.baseUrl + "extract/" + CardAssets.apkVersion + "2/CARDFRAME2.PNG";
                const ret = new GraphicDescription(url, 0, 0, 102, 102);
                let dx = -1;
                switch (color) {
                    case ColorAttribute.Fire:
                        dx = 0;
                        break;
                    case ColorAttribute.Water:
                        dx = 1;
                        break;
                    case ColorAttribute.Wood:
                        dx = 2;
                        break;
                    case ColorAttribute.Light:
                        dx = 3;
                        break;
                    case ColorAttribute.Dark:
                        dx = 4;
                        break;
                }
                if (dx == -1) {
                    return null;
                }
                ret.offsetX = dx * ret.width;
                ret.offsetY = (isSubAttribute ? ret.height + 2 : 0);
                CardUiAssets.tryAddApkMetadata(ret, model);
                return ret;
            }
        }
        exports.CardUiAssets = CardUiAssets;
        class DataSource {
            constructor(errorReporter) {
                if (!errorReporter) {
                    throw "Requires reporter";
                }
                this.errorReporter = errorReporter;
            }
            static isAprilFools() {
                // const currentTime = new Date();
                // 3 = April
                // 1 = the actual date.
                // JS is weird.
                // const isAprilFools = currentTime.getMonth() == 3 && currentTime.getDate() == 1;
                if (DataSource.settings) {
                    return DataSource.settings.getBool(common_1.BoolSetting.APRIL_FOOLS);
                }
                return false;
                // return isAprilFools;
            }
            loadWithCache(label, url, callback) {
                try {
                    const json = decompress(localStorage.getItem("dataSourceCache" + label) || '');
                    if (json) {
                        const obj = JSON.parse(json);
                        if (obj.version == DataSource.Version) {
                            setTimeout(() => {
                                callback(obj.value);
                            }, 0);
                            return;
                        }
                    }
                }
                catch (e) {
                    // Well we tried
                    console.error(e);
                }
                const call = ajax_1.ajax(url);
                call.done((data) => {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    try {
                        const decompressed = JSON.stringify({ version: DataSource.Version, value: data });
                        localStorage.setItem("dataSourceCache" + label, compress(decompressed));
                    }
                    catch (e) {
                        console.error(e);
                    }
                    callback(data);
                });
                call.fail((error) => {
                    this.errorReporter.onError("Failed to load " + label + " data", error);
                    callback(null);
                });
            }
            loadVersion(callback) {
                const call = ajax_1.ajax(CardAssets.baseUrl + "extract/metadata/recentlyUpdated.json");
                call.done((data) => {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    DataSource.Version = data.date;
                    callback(data);
                });
                call.fail((error) => {
                    this.errorReporter.onError("Failed to load version data", error);
                    callback(null);
                });
            }
            loadCardData(callback) {
                const url = CardAssets.baseUrl + "extract/api/download_card_data.json";
                // if (AUGMENT_JP) {
                //   url = CardAssets.baseUrl + "extract/api/jp/download_card_data.json";
                // }
                this.loadWithCache("CardData", url, callback);
            }
            loadCardDataJP(callback) {
                // let url = CardAssets.baseUrl + "extract/api/download_card_data.json";
                // if (AUGMENT_JP) {
                const url = CardAssets.baseUrl + "extract/api/jp/download_card_data.json";
                // }
                this.loadWithCache("CardDataJP", url, callback);
            }
            loadPlayerSkillData(callback) {
                let url = CardAssets.baseUrl + "extract/api/download_skill_data.json";
                // if (AUGMENT_JP) {
                //   url = CardAssets.baseUrl + "extract/api/jp/download_skill_data.json";
                // }
                this.loadWithCache("PlayerSkill", url, callback);
            }
            loadPlayerSkillDataJP(callback) {
                // let url = CardAssets.baseUrl + "extract/api/download_skill_data.json";
                // if (AUGMENT_JP) {
                let url = CardAssets.baseUrl + "extract/api/jp/download_skill_data.json";
                // }
                this.loadWithCache("PlayerSkillJP", url, callback);
            }
            loadEnemySkillData(callback) {
                let url = CardAssets.baseUrl + "extract/api/download_enemy_skill_data.json";
                // if (AUGMENT_JP) {
                //   url = CardAssets.baseUrl + "extract/api/jp/download_enemy_skill_data.json";
                // }
                this.loadWithCache("EnemySkill", url, callback);
            }
            loadEnemySkillDataJP(callback) {
                // let url = CardAssets.baseUrl + "extract/api/download_enemy_skill_data.json";
                // if (AUGMENT_JP) {
                let url = CardAssets.baseUrl + "extract/api/jp/download_enemy_skill_data.json";
                // }
                this.loadWithCache("EnemySkillJP", url, callback);
            }
            loadApkMetadata(callback) {
                const url = CardAssets.baseUrl + "extract/metadata/" + CardAssets.apkVersion + ".json";
                this.loadWithCache("ApkMetadata", url, callback);
            }
            loadMonsMetadata(callback) {
                const url = CardAssets.baseUrl + "extract/metadata/mons.json";
                this.loadWithCache("MonsMetadata", url, callback);
            }
            loadDungeonData(callback) {
                const url = CardAssets.baseUrl + "extract/api/download_dungeon_data.json";
                this.loadWithCache("Dungeon", url, callback);
            }
        }
        DataSource.Version = "";
        DataSource.settings = undefined;
        class GraphicDescription {
            constructor(url, offsetX, offsetY, width, height, baseWidth = undefined, baseHeight = undefined) {
                this.scale = 1;
                if (baseWidth === void 0) {
                    baseWidth = 0;
                }
                if (baseHeight === void 0) {
                    baseHeight = 0;
                }
                this.scale = 1;
                this.url = url;
                this.offsetX = offsetX;
                this.offsetY = offsetY;
                this.width = width;
                this.height = height;
                this.baseHeight = baseHeight;
                this.baseWidth = baseWidth;
            }
        }
        class Ilmina {
            // Initialization
            constructor() {
                this.cards = {};
                this.errorMessage = (s) => s;
                this.model = new Model();
                this.apkMetadata = {};
                this.ready = false;
                // Helpers
                this.init();
            }
            // Public methods
            onError(simpleDescription, fullDescription) {
                console.error(simpleDescription);
                console.error(fullDescription);
            }
            init() {
                console.log("Loading card data...");
                const dataSource = new DataSource(this);
                dataSource.loadVersion(() => {
                    const modelBuilder = new ModelBuilder();
                    let totalCounts = 0;
                    let countRemaining = 0;
                    const decrementCount = () => {
                        countRemaining--;
                        const loadingBar = document.getElementById('valeria-loading');
                        if (loadingBar) {
                            const percentageCleared = `${Math.round(100 * (totalCounts - countRemaining) / totalCounts)}%`;
                            const flavorText = LOADING_TEXTS[Math.floor(Math.random() * LOADING_TEXTS.length)];
                            loadingBar.innerText = flavorText + ': ' + percentageCleared;
                            loadingBar.style.width = percentageCleared;
                        }
                        if (countRemaining == 0) {
                            this.finishedLoadingData(modelBuilder);
                        }
                    };
                    countRemaining++; // Card groups
                    totalCounts++;
                    dataSource.loadCardData((x) => {
                        this.parseCardData(x, modelBuilder);
                        if (!AUGMENT_JP) {
                            decrementCount();
                            return;
                        }
                        dataSource.loadCardDataJP((y) => {
                            this.parseCardData(y, modelBuilder);
                            decrementCount();
                        });
                    });
                    countRemaining++;
                    totalCounts++;
                    dataSource.loadMonsMetadata((x) => { modelBuilder.buildMonsMetadata(x); decrementCount(); });
                    countRemaining++;
                    totalCounts++;
                    dataSource.loadApkMetadata((x) => { modelBuilder.buildApkMetadata(x); decrementCount(); });
                    countRemaining++;
                    totalCounts++;
                    dataSource.loadPlayerSkillData((x) => {
                        this.parsePlayerSkillData(x, modelBuilder);
                        if (!AUGMENT_JP) {
                            decrementCount();
                            return;
                        }
                        dataSource.loadPlayerSkillDataJP((y) => {
                            this.parsePlayerSkillData(y, modelBuilder);
                            decrementCount();
                        });
                    });
                    countRemaining++;
                    totalCounts++;
                    dataSource.loadEnemySkillData((x) => {
                        modelBuilder.buildEnemySkillsData(x);
                        if (!AUGMENT_JP) {
                            decrementCount();
                            return;
                        }
                        dataSource.loadEnemySkillDataJP((y) => {
                            modelBuilder.buildEnemySkillsData(y);
                            decrementCount();
                        });
                    });
                });
            }
            parseCardData(data, builder) {
                if (!data) {
                    return;
                }
                console.log("Parsing card data...");
                data.card.forEach((v) => {
                    builder.buildCard(v);
                });
            }
            parsePlayerSkillData(data, builder) {
                if (!data) {
                    return;
                }
                builder.buildPlayerSkillData(data.skill);
            }
            finishedLoadingData(builder) {
                const model = builder.build();
                // Manually put in P'numas's link back.
                model.cards[5987].transformsTo = 5986;
                this.model = model;
                this.finishedDataRender();
            }
            finishedDataRender() {
                this.setClockTimer();
                this.ready = true;
                console.log('The FLOOF is READY');
            }
            setClockTimer() {
                setInterval(() => {
                    DateConverter.updateTime();
                }, 1000);
            }
            getCard(id) {
                const maybeCard = this.model.cards[id];
                if (maybeCard) {
                    return maybeCard;
                }
                const c = new Card();
                c.id = id;
                return c;
            }
            hasCard(id) {
                return Boolean(this.model.cards[id]);
            }
            getEnemySkill(id) {
                return this.model.enemySkills[id];
            }
            getPlayerSkill(id) {
                return this.model.playerSkills[id];
            }
            getModel() {
                return this.model;
            }
        }
        const Awakening = {
            "Super": -1, '-1': "Super",
            "Unknown": 0, '0': "Unknown",
            "EnhancedHP": 1, '1': "EnhancedHP",
            "EnhancedATK": 2, '2': "EnhancedATK",
            "EnhancedRCV": 3, '3': "EnhancedRCV",
            "FireResist": 4, '4': "FireResist",
            "WaterResist": 5, '5': "WaterResist",
            "WoodResist": 6, '6': "WoodResist",
            "LightResist": 7, '7': "LightResist",
            "DarkResist": 8, '8': "DarkResist",
            "Autoheal": 9, '9': "Autoheal",
            "BindResist": 10, '10': "BindResist",
            "BlindResist": 11, '11': "BlindResist",
            "JammerResist": 12, '12': "JammerResist",
            "PoisonResist": 13, '13': "PoisonResist",
            "FireEnhance": 14, '14': "FireEnhance",
            "WaterEnhance": 15, '15': "WaterEnhance",
            "WoodEnhance": 16, '16': "WoodEnhance",
            "LightEnhance": 17, '17': "LightEnhance",
            "DarkEnhance": 18, '18': "DarkEnhance",
            "TimeExtend": 19, '19': "TimeExtend",
            "BindRecovery": 20, '20': "BindRecovery",
            "SkillBoost": 21, '21': "SkillBoost",
            "FireRow": 22, '22': "FireRow",
            "WaterRow": 23, '23': "WaterRow",
            "WoodRow": 24, '24': "WoodRow",
            "LightRow": 25, '25': "LightRow",
            "DarkRow": 26, '26': "DarkRow",
            "TPA": 27, '27': "TPA",
            "SBR": 28, '28': "SBR",
            "HeartEnhance": 29, '29': "HeartEnhance",
            "Multiboost": 30, '30': "Multiboost",
            "DragonKiller": 31, '31': "DragonKiller",
            "GodKiller": 32, '32': "GodKiller",
            "DevilKiller": 33, '33': "DevilKiller",
            "MachineKiller": 34, '34': "MachineKiller",
            "BalancedKiller": 35, '35': "BalancedKiller",
            "AttackerKiller": 36, '36': "AttackerKiller",
            "PhysicalKiller": 37, '37': "PhysicalKiller",
            "HealerKiller": 38, '38': "HealerKiller",
            "EvoKiller": 39, '39': "EvoKiller",
            "AwakeningKiller": 40, '40': "AwakeningKiller",
            "EnhanceKiller": 41, '41': "EnhanceKiller",
            "RedeemableKiller": 42, '42': "RedeemableKiller",
            "SevenCombo": 43, '43': "SevenCombo",
            "Guardbreak": 44, '44': "Guardbreak",
            "FUA": 45, '45': "FUA",
            "TeamHP": 46, '46': "TeamHP",
            "TeamRCV": 47, '47': "TeamRCV",
            "VDP": 48, '48': "VDP",
            "EquipAssist": 49, '49': "EquipAssist",
            "SuperFUA": 50, '50': "SuperFUA",
            "RainbowHaste": 51, '51': "RainbowHaste",
            "UnbindablePlus": 52, '52': "UnbindablePlus",
            "TimeExtendPlus": 53, '53': "TimeExtendPlus",
            "CloudResist": 54, '54': "CloudResist",
            "ScrollResist": 55, '55': "ScrollResist",
            "SkillBoostPlus": 56, '56': "SkillBoostPlus",
            "HP80": 57, '57': "HP80",
            "HP50": 58, '58': "HP50",
            "LShield": 59, '59': "LShield",
            "LUnlock": 60, '60': "LUnlock",
            "TenCombo": 61, '61': "TenCombo",
            "ComboOrb": 62, '62': "ComboOrb",
            "Voice": 63, '63': "Voice",
            "Dungeon": 64, '64': "Dungeon",
            "HpMinus": 65, '65': "HpMinus",
            "AtkMinus": 66, '66': "AtkMinus",
            "RcvMinus": 67, '67': "RcvMinus",
            "BlindResistPlus": 68, '68': "BlindResistPlus",
            "JammerResistPlus": 69, '69': "JammerResistPlus",
            "PoisonResistPlus": 70, '70': "PoisonResistPlus",
            "JammerSkyfall": 71, '71': "JammerSkyfall",
            "PoisonSkyfall": 72, '72': "PoisonSkyfall",
            "Unknown73": 73, '73': "Unknown73",
            "Unknown74": 74, '74': "Unknown74",
            "Unknown75": 75, '75': "Unknown75",
            "Unknown76": 76, '76': "Unknown76",
        };
        class Card {
            constructor() {
                this.id = -1;
                this.monsterPoints = -1;
                /**
                 * Bit flags
                 * &1: Can be inherited onto another monster.
                 * &2: Can be an inherit base.
                 * &4: ??? Has something to do with collabs.
                 * &8: Set if the monster is unstackable (Only occurs for evo, enhance, awakenings)
                 * &16: Set if this monster cannot be used on a team.
                 * &32: Set if the monster can take extra latent slots (e.g. Revos and SRevos)
                 */
                this.inheritanceType = 0;
                this.unknownData = [];
                this.name = "";
                this.japaneseName = "";
                this.attribute = ColorAttribute.None;
                this.subattribute = ColorAttribute.None;
                this.collab = -1;
                this.isEvoReversable = false;
                this.types = [];
                this.starCount = 0;
                this.cost = 0;
                this.evoType = EvolutionType.Normal;
                this.maxLevel = 0;
                this.feedExpPerLevel = 0;
                this.sellPricePerLevel = 0;
                this.minHp = 0;
                this.maxHp = 0;
                this.minAtk = 0;
                this.maxAtk = 0;
                this.minRcv = 0;
                this.maxRcv = 0;
                this.expCurve = 0;
                this.activeSkillId = 0;
                this.leaderSkillId = 0;
                this.turnTimer = 0;
                this.technicalTurnTimer = 0; // If this is 0, default to turnTimer value.
                this.evoFromId = 0;
                this.evoMaterials = [];
                this.devoMaterials = [];
                this.enemySkills = [];
                this.awakenings = [];
                this.superAwakenings = [];
                this.latentKillers = [];
                this.isInheritable = false;
                this.extraSlottable = false;
                this.isLimitBreakable = false;
                this.limitBreakStatGain = 0;
                this.isAlt = false;
                this.altBaseCardId = -1;
                this.alternateVersions = [];
                this.exchangesTo = [];
                this.exchangesFrom = [];
                this.voiceId = 0;
                this.orbSkin = 0;
                this.charges = 0;
                this.chargeGain = 0;
                this.enemyHpAtLv1 = 0;
                this.enemyHpAtLv10 = 0;
                this.enemyHpCurve = 0;
                this.enemyAtkAtLv1 = 0;
                this.enemyAtkAtLv10 = 0;
                this.enemyAtkCurve = 0;
                this.enemyDefAtLv1 = 0;
                this.enemyDefAtLv10 = 0;
                this.enemyDefCurve = 0;
                this.maxEnemyLevel = 0;
                this.enemyCoinsAtLv2 = 0;
                this.enemyExpAtLv2 = 0;
                this.groups = [];
                this.evoTreeBaseId = -1;
                this.atkGrowth = 1;
                this.hpGrowth = 1;
                this.rcvGrowth = 1;
                /**
                 * Note that this is only a guess.
                 * Size of a monster in a dungeon.
                 * 5 is full-width (#1465 Awoken Thoth)
                 * 4 is half-width (#1464 Thoth)
                 * 3 and below are smaller.  Not sure what the exact percentage is.
                 */
                this.monsterSize = 0;
                this.groupingKey = 0; // How monsters are sorted in the Monster Book.
                this.latentId = 0; // Latents for fusion.
                this.transformsTo = -1;
                /**
                 * 0: Old AI: Does 100% basic attack when initial preempt is unreachable.
                 * 1: Current AI: Moves to next skill if a preempt is unreachable.
                 */
                this.aiVersion = 0;
            }
        }
        exports.Card = Card;
        class CardEnemySkill {
            constructor() {
                this.enemySkillId = -1;
                this.ai = -1;
                this.rnd = -1;
            }
        }
        class ImageMetadata {
            constructor() {
                this.filename = '';
                this.width = -1;
                this.height = -1;
            }
        }
        const CardType = {
            "None": -1, "-1": "None",
            "Evo": 0, "0": "Evo",
            "Balanced": 1, "1": "Balanced",
            "Physical": 2, "2": "Physical",
            "Healer": 3, "3": "Healer",
            "Dragon": 4, "4": "Dragon",
            "God": 5, "5": "God",
            "Attacker": 6, "6": "Attacker",
            "Devil": 7, "7": "Devil",
            "Machine": 8, "8": "Machine",
            "UNKNOWN9": 9, "9": "UNKNOWN9",
            "UNKNOWN10": 10, "10": "UNKNOWN10",
            "UNKNOWN11": 11, "11": "UNKNOWN11",
            "Awakening": 12, "12": "Awakening",
            "UNKNOWN13": 13, "13": "UNKNOWN13",
            "Enhance": 14, "14": "Enhance",
            "Redeemable": 15, "15": "Redeemable",
        };
        const CollabGroup = {
            "None": 0, "0": "None",
            "Ragnarok": 1, "1": "Ragnarok",
            "Taiko": 2, "2": "Taiko",
            "ECO": 3, "3": "ECO",
            "UNKNOWN4": 4, "4": "UNKNOWN4",
            "Gunma": 5, "5": "Gunma",
            "FFCD": 6, "6": "FFCD",
            "Necky": 7, "7": "Necky",
            "Punt": 8, "8": "Punt",
            "Android": 9, "9": "Android",
            "Shinrabansho": 10, "10": "Shinrabansho",
            "Kapibara": 11, "11": "Kapibara",
            "CrazyTower": 12, "12": "CrazyTower",
            "TenkaTrigger": 13, "13": "TenkaTrigger",
            "EVA": 14, "14": "EVA",
            "SevenEleven": 15, "15": "SevenEleven",
            "ClashOfClans": 16, "16": "ClashOfClans",
            "GrooveCoaster": 17, "17": "GrooveCoaster",
            "ROACE": 18, "18": "ROACE",
            "DragonsDogma": 19, "19": "DragonsDogma",
            "Takaoka": 20, "20": "Takaoka",
            "BattleCats": 21, "21": "BattleCats",
            "Batman": 22, "22": "Batman",
            "BaskinRobbins": 23, "23": "BaskinRobbins",
            "AngryBirds": 24, "24": "AngryBirds",
            "UNKNOWN25": 25, "25": "UNKNOWN25",
            "HxH": 26, "26": "HxH",
            "HelloKitty": 27, "27": "HelloKitty",
            "PADBT": 28, "28": "PADBT",
            "BEAMS": 29, "29": "BEAMS",
            "Dragonball": 30, "30": "Dragonball",
            "SaintSeiya": 31, "31": "SaintSeiya",
            "RoadToDragons": 32, "32": "RoadToDragons",
            "DivineGate": 33, "33": "DivineGate",
            "SummonsBoard": 34, "34": "SummonsBoard",
            "Picotto": 35, "35": "Picotto",
            "Bikkuriman": 36, "36": "Bikkuriman",
            "AngryBirdsEpic": 37, "37": "AngryBirdsEpic",
            "DC": 38, "38": "DC",
            "Chibis1": 39, "39": "Chibis1",
            "NorthStar": 40, "40": "NorthStar",
            "Chibis2": 41, "41": "Chibis2",
            "UNKNOWN42": 42, "42": "UNKNOWN42",
            "UNKNOWN43": 43, "43": "UNKNOWN43",
            "Chibis3": 44, "44": "Chibis3",
            "FinalFantasy": 45, "45": "FinalFantasy",
            "GhostInTheShell": 46, "46": "GhostInTheShell",
            "DuelMasters": 47, "47": "DuelMasters",
            "AttackOnTitan": 48, "48": "AttackOnTitan",
            "NinjaHattori": 49, "49": "NinjaHattori",
            "ShohenSunday": 50, "50": "ShohenSunday",
            "UNKNOWN51": 51, "51": "UNKNOWN51",
            "Bleach": 52, "52": "Bleach",
            "BatmanVSuperman": 53, "53": "BatmanVSuperman",
            "UNKNOWN54": 54, "54": "UNKNOWN54",
            "PhoenixWright": 55, "55": "PhoenixWright",
            "Kenshin": 56, "56": "Kenshin",
            "Pepper": 57, "57": "Pepper",
            "Kinnikuman": 58, "58": "Kinnikuman",
            "NappingPrincess": 59, "59": "NappingPrincess",
            "Magazine": 60, "60": "Magazine",
            "MonsterHunter": 61, "61": "MonsterHunter",
            "CoroCoroMagaize": 62, "62": "CoroCoroMagaize",
            "Voltron": 63, "63": "Voltron",
            "DCUniverse": 64, "64": "DCUniverse",
            "FMA": 65, "65": "FMA",
            "KOF": 66, "66": "KOF",
            "YuYuHakusho": 67, "67": "YuYuHakusho",
            "Persona": 68, "68": "Persona",
            "CocaCola": 69, "69": "CocaCola",
            "MTG": 70, "70": "MTG",
            "ChronoMaGia": 71, "71": "ChronoMaGia",
            "SeventhRebirth": 72, "72": "SeventhRebirth",
            "CalcioFantasista": 73, "73": "CalcioFantasista",
            "PowerPro": 74, "74": "PowerPro",
            "Gintama": 75, "75": "Gintama",
            "SAO": 76, "76": "SAO",
            "KamenRider": 77, "77": "KamenRider",
            "YokaiWatch": 78, "78": "YokaiWatch",
            "Fate": 79, "79": "Fate",
            "StreetFighterV": 80, "80": "StreetFighterV",
            "UNKNOWN81": 81, "81": "UNKNOWN81",
            "UNKNOWN82": 82, "82": "UNKNOWN82",
            "ShamanKing": 83, "83": "ShamanKing",
            "UNKNOWN84": 84, "84": "UNKNOWN84",
            "Samsho": 85, "85": "Samsho",
            "PowerRangers": 86, "86": "PowerRangers",
            "Fujimi": 87, "87": "Fujimi",
            "UNKNOWN88": 88, "88": "UNKNOWN88",
            "UNKNOWN89": 89, "89": "UNKNOWN89",
            "Alts": 999, "999": "Alts",
            "DragonboundsDragoncallers": 10001, "10001": "DragonboundsDragoncallers",
        };
        const ColorAttribute = {
            "None": -1,
            "Fire": 0,
            "Water": 1,
            "Wood": 2,
            "Light": 3,
            "Dark": 4,
            "Heal": 5,
            "Jammer": 6,
            "Poison": 7,
            "MortalPoison": 8,
            "Bomb": 9,
            '-1': "None",
            '0': "Fire",
            '1': "Water",
            '2': "Wood",
            '3': "Light",
            '4': "Dark",
            '5': "Heal",
            '6': "Jammer",
            '7': "Poison",
            '8': "MortalPoison",
            '9': "Bomb",
        };
        class EnemySkill {
            constructor() {
                this.id = -1;
                this.name = '';
                this.usageText = '';
                this.internalEffectId = -1;
                this.skillArgs = [];
                this.ratio = 100;
                this.aiArgs = [100, 100, 10000, 0, 0];
            }
        }
        exports.EnemySkill = EnemySkill;
        class EvolutionTreeDetails {
            constructor(baseId) {
                this.cards = [];
                this.baseId = baseId;
            }
        }
        const EvolutionType = {
            "Normal": 0, "0": "Normal",
            "Ultimate": 1, "1": "Ultimate",
            "Reincarnated": 2, "2": "Reincarnated",
            "Assist": 3, "3": "Assist",
            "Pixel": 4, "4": "Pixel",
            "SuperReincarnated": 5, "5": "SuperReincarnated",
        };
        const LatentAwakening = {
            // WARNING: There are official IDs that you can extract from player_info; however, I don't know what those are
            // Do not rely on any of these IDs being correct without doing research. For now they're arbitrary.
            "None": -1, "-1": "None",
            "AllStats": 0, "0": "AllStats",
            "EvoKiller": 1, "1": "EvoKiller",
            "AwakenKiller": 2, "2": "AwakenKiller",
            "EnhancerKiller": 3, "3": "EnhancerKiller",
            "RedeemableKiller": 4, "4": "RedeemableKiller",
            "GodKiller": 5, "5": "GodKiller",
            "DragonKiller": 6, "6": "DragonKiller",
            "DevilKiller": 7, "7": "DevilKiller",
            "MachineKiller": 8, "8": "MachineKiller",
            "BalancedKiller": 9, "9": "BalancedKiller",
            "AttackerKiller": 10, "10": "AttackerKiller",
            "PhysicalKiller": 11, "11": "PhysicalKiller",
            "HealerKiller": 12, "12": "HealerKiller",
            "HpPlus": 13, "13": "HpPlus",
            "AtkPlus": 14, "14": "AtkPlus",
            "RcvPlus": 15, "15": "RcvPlus",
            "TimeExtendPlus": 16, "16": "TimeExtendPlus",
            "FireResistPlus": 17, "17": "FireResistPlus",
            "WaterResistPlus": 18, "18": "WaterResistPlus",
            "WoodResistPlus": 19, "19": "WoodResistPlus",
            "LightResistPlus": 20, "20": "LightResistPlus",
            "DarkResistPlus": 21, "21": "DarkResistPlus",
            "Hp": 22, "22": "Hp",
            "Atk": 23, "23": "Atk",
            "Rcv": 24, "24": "Rcv",
            "TimeExtend": 25, "25": "TimeExtend",
            "AutoHeal": 26, "26": "AutoHeal",
            "FireResist": 27, "27": "FireResist",
            "WaterResist": 28, "28": "WaterResist",
            "WoodResist": 29, "29": "WoodResist",
            "LightResist": 30, "30": "LightResist",
            "DarkResist": 31, "31": "DarkResist",
            "SkillDelayResist": 32, "32": "SkillDelayResist",
        };
        class Model {
            constructor() {
                this.cards = {};
                this.cardMetadata = {};
                this.apkMetadata = {};
                this.evoTrees = {};
                this.enemySkills = {};
                this.playerSkills = [];
                this.cardGroups = [];
                this.usedCollabs = [];
                this.allExchanges = [];
                this.dungeons = {};
            }
        }
        class DateConverter {
            static now(dt = undefined) {
                if (dt) {
                    DateConverter.date = dt;
                }
                return DateConverter.date;
            }
            static updateTime() {
                DateConverter.now(new Date().getTime());
            }
            static isForever(time) {
                if (time.getUTCFullYear() > 2036) {
                    return true;
                }
                return false;
            }
            static convertToDate(input) {
                if (input == "") {
                    return null;
                }
                const year = "20" + input.substr(0, 2);
                const month = input.substr(2, 2);
                const day = input.substr(4, 2);
                const hour = input.substr(6, 2);
                const minute = input.substr(8, 2);
                const second = input.substr(10, 2);
                const utcOffset = Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second), 0);
                return new Date(utcOffset + 8 * 60 * 60 * 1000);
            }
            static shouldDisplayCountdown(end) {
                const time = end.getTime();
                const now = new Date().getTime(); // Using this to avoid recalculating if we should or shouldn't
                if (now > time) {
                    // Already ended
                    return false;
                }
                if (time > now + this.limit) {
                    // More than 1 week
                    return false;
                }
                return true;
            }
            static getCountdown(end) {
                let time = end.getTime();
                time -= DateConverter.now();
                if (time < 0 || time > this.limit) {
                    return "--:--:--";
                }
                let ret = "";
                const second = 1000;
                const minute = second * 60;
                const hour = minute * 60;
                const day = hour * 24;
                const days = Math.floor(time / day);
                time -= day * days;
                const hours = Math.floor(time / hour);
                time -= hour * hours;
                const minutes = Math.floor(time / minute);
                time -= minute * minutes;
                const seconds = Math.floor(time / second);
                time -= second * seconds;
                if (days > 0) {
                    ret += days;
                    if (days == 1) {
                        ret += " day";
                    }
                    else {
                        ret += " days";
                    }
                    if (hour > 0) {
                        ret += " and ";
                        ret += hours;
                        if (hour == 1) {
                            ret += " hour";
                        }
                        else {
                            ret += " hours";
                        }
                    }
                    return ret;
                }
                function pad(time) {
                    return ("00" + String(time)).slice(-2);
                }
                return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
            }
        }
        DateConverter.date = new Date().getTime();
        DateConverter.limit = (90 * 24 * 60 * 60 * 1000);
        class PlayerSkill {
            constructor() {
                this.id = -1;
                this.name = '';
                this.maxLevel = -1;
                this.description = '';
                this.internalEffectId = -1;
                this.initialCooldown = -1;
                this.maxCooldown = -1;
                this.cardIds = [];
                this.parsedEffects = [];
                this.internalEffectArguments = [];
                // Deprecated
                this.Effects = [];
                this.orbColours = []; //dumb attribute to cater to orbchangers without redoing the skill system
            }
        }
        class ModelBuilder {
            constructor() {
                this.cardIdsBySkillId = {};
                this.model = new Model();
            }
            buildCard(cardData) {
                try {
                    const card = this.buildCardInternal(cardData);
                    if (!card.name) {
                        return;
                    }
                    this.buildEvoTree(card);
                }
                catch (e) {
                    throw "Failed to parse card data (" + JSON.stringify(cardData) + ") - " + e;
                }
            }
            buildPlayerSkillData(playerSkillData) {
                const playerSkills = new Array(playerSkillData.length);
                for (let i = this.model.playerSkills.length; i < playerSkillData.length; i++) {
                    const reader = new RawDataReader(playerSkillData[i]);
                    const skill = new PlayerSkill();
                    skill.id = i;
                    skill.name = reader.readString();
                    skill.description = reader.readString();
                    skill.internalEffectId = reader.readNumber();
                    skill.maxLevel = reader.readNumber();
                    skill.initialCooldown = reader.readNumber();
                    skill.maxCooldown = skill.initialCooldown - skill.maxLevel + 1;
                    reader.readString(); // Seems always empty
                    const data = new Array(reader.countRemaining());
                    for (let j = 0; j < data.length; j++) {
                        data[j] = reader.readNumber();
                    }
                    skill.internalEffectArguments = data;
                    playerSkills[i] = skill;
                }
                this.model.playerSkills = this.model.playerSkills.concat(playerSkills);
            }
            pushIfNotZero(ary, val) {
                if (val == 0) {
                    return;
                }
                ary.push(val);
            }
            buildEvoTree(card) {
                let evoTree = this.model.evoTrees[card.evoTreeBaseId];
                if (evoTree == null) {
                    evoTree = new EvolutionTreeDetails(card.evoTreeBaseId);
                    this.model.evoTrees[card.evoTreeBaseId] = evoTree;
                }
                evoTree.cards.push(card);
            }
            buildCardInternal(cardData) {
                const c = new Card();
                const reader = new RawDataReader(cardData);
                // const unknownData = [];
                c.id = reader.readNumber(); // 0
                if (this.model.cards[c.id]) {
                    return c;
                }
                // this.model.cards[c.id] = c;
                c.name = reader.readString(); // 1
                c.attribute = ColorAttribute[ColorAttribute[reader.readNumber()]]; // 2
                c.subattribute = ColorAttribute[ColorAttribute[reader.readNumber()]]; // 3
                c.isEvoReversable = reader.readNumber() == 1; // 4
                c.types.push(CardType[CardType[String(reader.readNumber())]]); // 5
                const type2 = CardType[CardType[String(reader.readNumber())]]; // 6
                if (type2 != CardType.None) {
                    c.types.push(type2);
                }
                c.starCount = reader.readNumber(); // 7
                c.cost = reader.readNumber(); // 8
                // These values are 0-5.
                // Higher correlation seems to be higher valued, but unclear why.
                // e.g. Cloud evolution is 5, 5, 5, 3, 4.
                // This is probably an enum to the relative size of the monster.
                c.monsterSize = reader.readNumber(); // 9
                c.maxLevel = reader.readNumber(); // 10
                c.feedExpPerLevel = reader.readNumber() / 4; // 11
                // 100: Far more common.
                // 1 seems to be related to not being released in NA.
                const usually100 = reader.readNumber(); // u1 12 // ??? Seems to always be 100
                if (usually100 != 100 && usually100 != 1) {
                    console.error(`Slot 12 is different!  Time to handle it.\nid: ${c.id} value: ${usually100}`);
                }
                c.sellPricePerLevel = reader.readNumber() / 10; // 13
                c.minHp = reader.readNumber(); // 14
                c.maxHp = reader.readNumber(); // 15
                c.hpGrowth = reader.readNumber(); // 16
                c.minAtk = reader.readNumber(); // 17
                c.maxAtk = reader.readNumber(); // 18
                c.atkGrowth = reader.readNumber(); // 19
                c.minRcv = reader.readNumber(); // 20
                c.maxRcv = reader.readNumber(); // 21
                c.rcvGrowth = reader.readNumber(); // 22
                c.expCurve = reader.readNumber(); // 23
                // 2.5: Far more common
                // 1 happens at the exact same time that unknownData[1] is 1.
                const usually25 = reader.readNumber(); // u2 24 // ??? Mostly 2.
                if (usually25 != 2.5 && usually25 != 1) {
                    console.error(`Slot 24 is different!  Time to handle it.\nid: ${c.id} value: ${usually25}`);
                }
                if ((usually100 == 100) != (usually25 == 2.5)) {
                    console.error(`Anomaly detected in slot 12 and 24. ${usually100} - ${usually25}`);
                }
                c.activeSkillId = reader.readNumber(); // 25
                c.leaderSkillId = reader.readNumber(); // 26
                c.turnTimer = reader.readNumber(); // 27
                c.enemyHpAtLv1 = reader.readNumber(); // 28
                c.enemyHpAtLv10 = reader.readNumber(); // 29
                c.enemyHpCurve = reader.readNumber(); // 30
                c.enemyAtkAtLv1 = reader.readNumber(); // 31
                c.enemyAtkAtLv10 = reader.readNumber(); // 32
                c.enemyAtkCurve = reader.readNumber(); // 33
                c.enemyDefAtLv1 = reader.readNumber(); // 34
                c.enemyDefAtLv10 = reader.readNumber(); // 35
                c.enemyDefCurve = reader.readNumber(); // 36
                c.maxEnemyLevel = reader.readNumber(); // 37
                c.enemyCoinsAtLv2 = reader.readNumber(); // 38
                c.enemyExpAtLv2 = reader.readNumber(); // 39
                c.evoFromId = reader.readNumber(); // 40
                this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 41
                this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 42
                this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 43
                this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 44
                this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 45
                this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 46
                this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 47
                this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 48
                this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 49
                this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 50
                // If it's not 0, then this is the Technical Dungeon turnTimer.
                c.technicalTurnTimer = reader.readNumber(); // 51
                // 0s and 1s, unclear. Obviously a flag, but for what?
                c.aiVersion = reader.readNumber(); // 52
                c.charges = reader.readNumber(); // 53
                c.chargeGain = reader.readNumber(); // 54
                // 0 for all monsters except:
                //  *    1 - [#495] Love Deity, Feline Bastet
                //  * 1000 - [#111] Vampire Lord
                // For all purposes, we should ignore this.
                const usuallyZero = reader.readNumber();
                if (usuallyZero) {
                    if (!(usuallyZero == 1 && c.id == 495) && !(usuallyZero == 1000 && c.id == 111)) {
                        console.error(`Slot 55 is different, time to handle it!\nid: ${c.id} value: ${usuallyZero}`);
                    }
                }
                // unknownData.push(reader.readNumber()); // 55 // ??? u4
                // Currently *always* 0.  Probably a reserved area for future changes/flags.
                const alwaysZero = reader.readNumber();
                if (alwaysZero) {
                    console.error(`Slot 56 is non-zero, time to handle it!\n id: ${c.id} value: ${alwaysZero}`);
                }
                // unknownData.push(alwaysZero); // 56 // ??? u5
                const skillCount = reader.readNumber(); // 57
                for (let i = 0; i < skillCount; i++) {
                    const enemySkill = new CardEnemySkill();
                    enemySkill.enemySkillId = reader.readNumber();
                    enemySkill.ai = reader.readNumber();
                    enemySkill.rnd = reader.readNumber();
                    c.enemySkills.push(enemySkill);
                }
                const awakeningCount = reader.readNumber();
                for (let i = 0; i < awakeningCount; i++) {
                    c.awakenings.push(Awakening[Awakening[String(reader.readNumber())]]);
                }
                const superAwakenings = reader.readString();
                if (superAwakenings != "") {
                    const superAwakenings2 = superAwakenings.split(",");
                    for (let i = 0; i < superAwakenings2.length; i++) {
                        const superAwakening = superAwakenings2[i];
                        c.superAwakenings.push(Awakening[Awakening[superAwakening]]);
                    }
                }
                c.evoTreeBaseId = reader.readNumber();
                c.groupingKey = reader.readNumber();
                const type3 = CardType[CardType[String(reader.readNumber())]];
                if (type3 != CardType.None) {
                    c.types.push(type3);
                }
                c.monsterPoints = reader.readNumber();
                c.latentId = reader.readNumber();
                c.collab = CollabGroup[CollabGroup[reader.readNumber()]];
                c.inheritanceType = reader.readNumber();
                c.isInheritable = ((c.inheritanceType & 1) == 1);
                c.extraSlottable = ((c.inheritanceType & 32) == 32);
                c.japaneseName = reader.readString();
                c.limitBreakStatGain = reader.readNumber();
                c.isLimitBreakable = c.limitBreakStatGain > 0;
                c.voiceId = reader.readNumber();
                c.orbSkin = reader.readNumber();
                const maybeTransform = reader.read();
                if (maybeTransform.length) {
                    c.transformsTo = parseInt(maybeTransform.substring(5));
                }
                // c.unknownData = unknownData;
                if (!reader.isEmpty()) {
                    //throw "Excess data detected";
                    console.log("excess data detected");
                }
                // Handle aliases
                this.registerSkillOwnedByCard(c.activeSkillId, c.id);
                this.registerSkillOwnedByCard(c.leaderSkillId, c.id);
                this.model.cards[c.id] = c;
                if (CardAssets.isAlt(c)) {
                    c.isAlt = true;
                    c.altBaseCardId = CardAssets.getAltBaseId(c);
                    // For now this works. This may not work in the future.
                    const baseCard = this.model.cards[c.altBaseCardId];
                    if (baseCard) {
                        baseCard.alternateVersions.push(c.id);
                    }
                    else {
                        console.error("Alt " + c.id + " can't find base " + c.altBaseCardId);
                    }
                }
                // Set latent killers
                const isBalanced = c.types.indexOf(CardType.Balanced) >= 0;
                if (isBalanced || c.types.indexOf(CardType.Healer) >= 0) {
                    c.latentKillers.push(LatentAwakening.DragonKiller);
                }
                if (isBalanced || c.types.indexOf(CardType.God) >= 0 || c.types.indexOf(CardType.Attacker) >= 0) {
                    c.latentKillers.push(LatentAwakening.DevilKiller);
                }
                if (isBalanced || c.types.indexOf(CardType.Dragon) >= 0 || c.types.indexOf(CardType.Physical) >= 0) {
                    c.latentKillers.push(LatentAwakening.MachineKiller);
                }
                if (isBalanced || c.types.indexOf(CardType.Devil) >= 0 || c.types.indexOf(CardType.Machine) >= 0) {
                    c.latentKillers.push(LatentAwakening.GodKiller);
                }
                if (isBalanced || c.types.indexOf(CardType.Machine) >= 0) {
                    c.latentKillers.push(LatentAwakening.BalancedKiller);
                }
                if (isBalanced || c.types.indexOf(CardType.Healer) >= 0) {
                    c.latentKillers.push(LatentAwakening.AttackerKiller);
                }
                if (isBalanced || c.types.indexOf(CardType.Attacker) >= 0) {
                    c.latentKillers.push(LatentAwakening.PhysicalKiller);
                }
                if (isBalanced || c.types.indexOf(CardType.Dragon) >= 0 || c.types.indexOf(CardType.Physical) >= 0) {
                    c.latentKillers.push(LatentAwakening.HealerKiller);
                }
                // All done
                return c;
            }
            registerSkillOwnedByCard(skillId, cardId) {
                let ary = this.cardIdsBySkillId[skillId];
                if (!ary) {
                    ary = [];
                    this.cardIdsBySkillId[skillId] = ary;
                }
                ary.push(cardId);
            }
            buildApkMetadata(data) {
                const apkMetadata = {};
                if (data) {
                    for (let key in data) {
                        const dataArray = data[key].images;
                        dataArray.forEach((data) => {
                            const metadata = new ImageMetadata();
                            metadata.filename = data.filename;
                            metadata.width = data.width;
                            metadata.height = data.height;
                            apkMetadata[metadata.filename] = metadata;
                        });
                    }
                }
                this.model.apkMetadata = apkMetadata;
            }
            buildEnemySkillsData(data) {
                if (!data) {
                    return;
                }
                const rawData = data.enemy_skills;
                if (!rawData) {
                    console.error("Unexpected enemy skill data");
                    console.error(data);
                    return;
                }
                //skill params are id, name, effectid, param identifier, params...
                //param identifier determines what params you'll get
                //hex number, resolving to a set of params from 0-14
                //0 - small textbox text on use
                //1-8 - skill parameters 0-7
                //9 - ratio?
                //10-14 - AI parameters 0-4
                this.splitEvilRawData(rawData, (lineSplit) => {
                    try {
                        if (lineSplit[0] == "c") {
                            // Ignore the checksum
                            return;
                        }
                        const currentSkill = new EnemySkill();
                        currentSkill.id = parseInt(lineSplit[0]);
                        if (this.model.enemySkills[currentSkill.id]) {
                            // Ignore already defined skills.
                            return;
                        }
                        currentSkill.name = lineSplit[1];
                        currentSkill.internalEffectId = parseInt(lineSplit[2]);
                        const dec = parseInt(lineSplit[3], 16); //parse the paramidentifiers. It's in hex bitflags
                        const skillParamsPresent = [];
                        //skillparamspresent will result in an array of numbers from 0-14
                        //determining what is given in the rest of the line
                        for (let i = 0; i < 16; i++) {
                            if (((dec >> i) & 1) == 1) {
                                skillParamsPresent.push(i);
                            }
                        }
                        if (lineSplit.length != skillParamsPresent.length + 4) {
                            throw "Unexpected split";
                        }
                        //default values for arguments 0-14
                        const args = ['', 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 10000, 0, 0];
                        for (let i = 0; i < skillParamsPresent.length; i++) {
                            args[skillParamsPresent[i]] = lineSplit[i + 4];
                        }
                        currentSkill.usageText = args[0];
                        for (let i = 1; i < 9; i++) {
                            if (typeof (args[i]) == "string") {
                                currentSkill.skillArgs[i - 1] = parseInt(args[i]);
                            }
                        }
                        currentSkill.ratio = parseInt(args[9]);
                        for (let i = 10; i < 15; i++) {
                            currentSkill.aiArgs[i - 10] = parseInt(args[i]);
                        }
                        this.model.enemySkills[currentSkill.id] = currentSkill;
                    }
                    catch (e) {
                        console.error("Failed to parse enemy skill line...");
                        console.error(lineSplit);
                        console.error(e);
                    }
                });
            }
            splitEvilRawData(rawData, callback) {
                let currentLine = [];
                let cellBuffer = "";
                let inQuote = false;
                for (let i = 0; i < rawData.length; i++) {
                    const currentCharacter = rawData[i];
                    if (inQuote) {
                        // You're allowed to have single quotes inside of the text :Nao:
                        // Can only tell if you're done by looking ahead
                        if (currentCharacter == "'" && i + 1 < rawData.length && (rawData[i + 1] == "," || rawData[i + 1] == "\n")) {
                            inQuote = false;
                            continue;
                        }
                        cellBuffer += currentCharacter;
                        continue;
                    }
                    if (currentCharacter == "'") {
                        inQuote = true;
                        continue;
                    }
                    if (currentCharacter == ",") {
                        currentLine.push(cellBuffer);
                        cellBuffer = "";
                        continue;
                    }
                    if (currentCharacter == "\n") {
                        currentLine.push(cellBuffer);
                        callback(currentLine);
                        currentLine = [];
                        cellBuffer = "";
                        continue;
                    }
                    cellBuffer += currentCharacter;
                }
                currentLine.push(cellBuffer);
                callback(currentLine);
            }
            buildMonsMetadata(data) {
                if (typeof data != "object") {
                    throw "Unexpected data: " + JSON.stringify(data);
                }
                const ret = {};
                if (data) {
                    for (let key in data) {
                        // format: mons_001.bc
                        let stringId = key.replace("mons_", "").replace(".bc", "");
                        while (stringId.length > 1 && stringId[0] == "0") {
                            stringId = stringId.substring(1);
                        }
                        const id = parseInt(stringId);
                        const data2 = data[key].images;
                        const metadata = [];
                        for (let i = 0; i < data2.length; i++) {
                            const meta = new ImageMetadata();
                            meta.filename = data2[i].filename;
                            meta.width = parseInt(data2[i].width);
                            meta.height = parseInt(data2[i].height);
                            metadata.push(meta);
                        }
                        ret[id] = metadata;
                    }
                }
                this.model.cardMetadata = ret;
            }
            connectMetadataToCards() {
                for (let id in this.model.cardMetadata) {
                    const card = this.model.cards[id];
                    if (!card) {
                        console.error("Id not found: " + id);
                        continue;
                    }
                    card.imageMetadata = this.model.cardMetadata[id];
                    // Alternate versions have the same metadata as their bases
                    for (let altIndx in card.alternateVersions) {
                        const altId = card.alternateVersions[altIndx];
                        const altCard = this.model.cards[altId];
                        altCard.imageMetadata = card.imageMetadata;
                    }
                }
            }
            connectCardIdsToSkills() {
                for (let skillId in this.cardIdsBySkillId) {
                    this.model.playerSkills[skillId].cardIds = this.cardIdsBySkillId[skillId];
                }
            }
            build() {
                this.connectMetadataToCards();
                this.connectCardIdsToSkills();
                const ret = this.model;
                return ret;
            }
        }
        class RawDataReader {
            constructor(data) {
                this.index = 0;
                this.data = data;
            }
            read() {
                if (this.index >= this.data.length) {
                    throw "Nothing left to read";
                }
                const ret = this.data[this.index];
                this.index++;
                return ret;
            }
            readNumber() {
                const ret = this.read();
                if (typeof ret !== "number") {
                    throw "Expected number, found " + typeof (ret) + " (" + ret + ") (index " + this.index + ")";
                }
                return ret;
            }
            readString() {
                const ret = this.read();
                if (typeof ret !== "string") {
                    throw "Expected string, found " + typeof (ret) + " (" + ret + ") (index " + this.index + ")";
                }
                return ret;
            }
            countRemaining() {
                return this.data.length - this.index;
            }
            isEmpty() {
                return this.index >= this.data.length;
            }
        }
        const floof = new Ilmina();
        exports.floof = floof;
        window.floof = floof;
        function loadSettings(settings) {
            DataSource.settings = settings;
        }
        exports.loadSettings = loadSettings;
    });
    /**
     All aliases of monsters and dungeons. Keep these in alphabetical order by
     alias. The value must be the exact ID of the monster or dungeon.
    
     Also, the alias MUST BE all lower-case.
    */
    define("fuzzy_search_aliases", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const MONSTER_ALIASES = {
            'bj': 5488,
        };
        exports.MONSTER_ALIASES = MONSTER_ALIASES;
        const DUNGEON_ALIASES = {
            'a shura': 4401001,
            'a. shura': 4401001,
            'a1': 1022001,
            'a2': 1022002,
            'a3': 1022003,
            'a4': 1022004,
            'a5': 1022005,
            'a6': 1022006,
            'aa1': 2660001,
            'aa2': 2660002,
            'aa3': 2660003,
            'aa4': 2660004,
            'ashura': 4401001,
            'alt shura': 4401001,
            'shura': 4400001,
            'ta1': 3638001,
            'ta2': 4182001,
        };
        exports.DUNGEON_ALIASES = DUNGEON_ALIASES;
    });
    define("fuzzy_search", ["require", "exports", "common", "ilmina_stripped", "fuzzy_search_aliases"], function (require, exports, common_2, ilmina_stripped_1, fuzzy_search_aliases_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const prefixToCardIds = {};
        let prioritizedEnemySearch = [];
        exports.prioritizedEnemySearch = prioritizedEnemySearch;
        let prioritizedMonsterSearch = [];
        exports.prioritizedMonsterSearch = prioritizedMonsterSearch;
        let prioritizedInheritSearch = [];
        exports.prioritizedInheritSearch = prioritizedInheritSearch;
        const LOW_PRIORITY_SUBSTRING = [
            ' disguise',
        ];
        function isLowPriority(s) {
            return LOW_PRIORITY_SUBSTRING.some((badSubstring) => {
                return s.toLowerCase().includes(badSubstring);
            });
        }
        function SearchInit() {
            const ids = Object.keys(ilmina_stripped_1.floof.getModel().cards).map((id) => Number(id));
            exports.prioritizedEnemySearch = prioritizedEnemySearch = ids.map((id) => ilmina_stripped_1.floof.getCard(id)).reverse();
            exports.prioritizedMonsterSearch = prioritizedMonsterSearch = ids.map((id) => ilmina_stripped_1.floof.getCard(id)).filter((card) => {
                return card.id < 100000;
            }).sort((card1, card2) => {
                if (isLowPriority(card1.name) != isLowPriority(card2.name)) {
                    return isLowPriority(card2.name) ? -1 : 1;
                }
                // First throw all equips towards the end.
                if (card1.awakenings[0] != card2.awakenings[0]) {
                    if (card2.awakenings[0] == common_2.Awakening.AWOKEN_ASSIST) {
                        return -1;
                    }
                    if (card1.awakenings[0] == common_2.Awakening.AWOKEN_ASSIST) {
                        return 1;
                    }
                }
                if (card2.monsterPoints != card1.monsterPoints) {
                    return card2.monsterPoints - card1.monsterPoints;
                }
                return card2.id - card1.id;
            });
            exports.prioritizedInheritSearch = prioritizedInheritSearch = prioritizedMonsterSearch.filter((card) => {
                // inheritanceType is defined with the flag &1.
                return Boolean(card);
            }).sort((card1, card2) => {
                if (card1.awakenings[0] != card2.awakenings[0]) {
                    if (card1.awakenings[0] == common_2.Awakening.AWOKEN_ASSIST) {
                        return -1;
                    }
                    if (card2.awakenings[0] == common_2.Awakening.AWOKEN_ASSIST) {
                        return 1;
                    }
                }
                return card2.id - card1.id;
            });
            for (const group of ilmina_stripped_1.floof.getModel().cardGroups) {
                for (const alias of group.aliases.filter((alias) => alias.indexOf(' ') == -1 && alias == alias.toLowerCase())) {
                    prefixToCardIds[alias] = group.cards;
                    if (alias == 'halloween') {
                        prefixToCardIds['h'] = group.cards;
                    }
                }
            }
        }
        exports.SearchInit = SearchInit;
        /**
         * Given text, finds the top maxResults monster IDs that match
         * the text in priority order:
         * 1) Exact ID
         * 2) Name Contains Substring
         *    a) Priotize where substrings are at the beginning or follow a space.
         * 4) Fuzzily matches (All letters are present in order in name)
         *    a) Prioritizes consecutive letters.
         * @param text
         * @param maxResults
         * @param searchArray
         * @param filtered
         */
        function fuzzyMonsterSearch(text, maxResults = 15, searchArray = undefined, filtered = false) {
            if (!text || text == '-1') {
                return [-1];
            }
            const result = [];
            searchArray = searchArray || prioritizedMonsterSearch;
            text = text.toLowerCase();
            if (fuzzy_search_aliases_1.MONSTER_ALIASES[text]) {
                result.push(fuzzy_search_aliases_1.MONSTER_ALIASES[text]);
            }
            let toEquip = false;
            let toBase = false;
            if (text.startsWith('equip')) {
                text = text.substring('equip'.length).trim();
                toEquip = true;
            }
            else if (text.startsWith('base')) {
                text = text.substring('base'.length).trim();
                toBase = true;
            }
            else if (text.startsWith('revo')) {
                text = text.replace('revo', 'reincarnated');
            }
            else if (text.startsWith('srevo')) {
                text = text.replace('srevo', 'super reincarnated');
            }
            // Test for exact match.
            if (ilmina_stripped_1.floof.hasCard(Number(text))) {
                result.push(Number(text));
            }
            let lowerPriority = [];
            let lowestPriority = [];
            // Search for monsters whose substrings work.
            for (const card of searchArray) {
                if (result.length >= maxResults) {
                    break;
                }
                const idx = card.name.toLowerCase().indexOf(text);
                if (idx < 0) {
                    continue;
                }
                if (idx == 0 || card.name[idx - 1] == ' ') {
                    if (idx + text.length == card.name.length || card.name[idx + text.length] == ' ') {
                        result.push(card.id);
                    }
                    else {
                        lowerPriority.push(card.id);
                    }
                }
                else {
                    lowestPriority.push(card.id);
                }
            }
            for (const id of lowerPriority) {
                if (result.length < maxResults) {
                    result.push(id);
                }
            }
            for (const id of lowestPriority) {
                if (result.length < maxResults) {
                    result.push(id);
                }
            }
            if (!filtered && result.length < maxResults) {
                let collabMatches = [];
                for (const prefix in prefixToCardIds) {
                    if (text.startsWith(prefix)) {
                        for (const match of fuzzyMonsterSearch(text.substring(prefix.length).trim(), maxResults, searchArray.filter((card) => prefixToCardIds[prefix].some((id) => id == card.id)))) {
                            if (!collabMatches.some((m) => m == match)) {
                                collabMatches.push(match);
                            }
                        }
                    }
                }
                for (const match of collabMatches) {
                    if (result.length < maxResults && !result.some((id) => id == match)) {
                        result.push(match);
                    }
                }
                const attributes = {
                    'r': 0, 'b': 1, 'g': 2, 'l': 3, 'd': 4, 'x': -1,
                };
                let attribute = -1;
                let subattribute = -2;
                let attributeText = '';
                let subattributeText = '';
                if (text.length > 2 && text[0] in attributes) {
                    attribute = attributes[text[0]];
                    attributeText = text.substring(1).trim();
                    if (attributeText.length > 2 && attributeText[0] in attributes) {
                        subattribute = attributes[attributeText[0]];
                        subattributeText = attributeText.substring(1).trim();
                    }
                }
                if (subattributeText) {
                    const filteredSub = searchArray.filter((card) => card.attribute == attribute && card.subattribute == subattribute);
                    const matches = fuzzyMonsterSearch(subattributeText, maxResults, filteredSub, true);
                    for (const match of matches) {
                        if (result.length < maxResults && !result.some((id) => id == match)) {
                            result.push(match);
                        }
                    }
                }
                if (attributeText) {
                    const filteredAttr = searchArray.filter((card) => card.attribute == attribute);
                    const matches = fuzzyMonsterSearch(attributeText, maxResults, filteredAttr, true);
                    for (const match of matches) {
                        if (result.length < maxResults && !result.some((id) => id == match)) {
                            result.push(match);
                        }
                    }
                }
            }
            lowerPriority.length = 0;
            let scoredPriority = [];
            // Fuzzy match with the name.
            // This prioritizes values with consecutive letters.
            for (const card of searchArray) {
                if (result.length >= maxResults) {
                    break;
                }
                if (result.some((id) => id == card.id)) {
                    continue;
                }
                const name = card.name.toLowerCase();
                let currentStringIdx = -1;
                let score = 0;
                let scoreDelta = 1;
                for (const c of text) {
                    const nextIdx = name.indexOf(c, currentStringIdx + 1);
                    if (nextIdx == currentStringIdx + 1) {
                        scoreDelta *= 2;
                    }
                    else {
                        scoreDelta = 1;
                    }
                    score += scoreDelta;
                    currentStringIdx = nextIdx;
                    if (currentStringIdx < 0) {
                        break;
                    }
                }
                if (currentStringIdx >= 0) {
                    scoredPriority.push([card.id, score]);
                    continue;
                }
            }
            scoredPriority.sort((a, b) => b[1] - a[1]);
            for (const match of scoredPriority) {
                if (result.length > maxResults) {
                    break;
                }
                result.push(match[0]);
            }
            if (toEquip) {
                let equips = [];
                for (const id of result) {
                    const treeId = ilmina_stripped_1.floof.getCard(id).evoTreeBaseId;
                    if (treeId in ilmina_stripped_1.floof.getModel().evoTrees) {
                        for (const card of ilmina_stripped_1.floof.getModel().evoTrees[treeId].cards) {
                            if (!equips.some((id) => id == card.id) && card.awakenings[0] == common_2.Awakening.AWOKEN_ASSIST) {
                                equips.push(card.id);
                            }
                        }
                    }
                }
                for (const id of result) {
                    if (!equips.some((i) => i == id)) {
                        equips.push(id);
                    }
                }
                if (equips.length > maxResults) {
                    equips.length = maxResults;
                }
                result.length = 0;
                for (const id of equips) {
                    result.push(id);
                }
            }
            if (toBase) {
                let bases = result.map((id) => ilmina_stripped_1.floof.getCard(id).evoTreeBaseId);
                const seen = new Set();
                result.length = 0;
                for (const id of bases) {
                    if (seen.has(id)) {
                        continue;
                    }
                    seen.add(id);
                    result.push(id);
                }
            }
            if (!result.length || result.every((id) => id == -1)) {
                return [-1];
            }
            return result.filter((id) => id != -1);
        }
        exports.fuzzyMonsterSearch = fuzzyMonsterSearch;
        function fuzzySearch(text, maxResults = 15, searchArray = [], aliases = {}) {
            if (!text) {
                return [];
            }
            text = text.toLowerCase();
            const result = [];
            if (aliases[text]) {
                result.push(aliases[text]);
            }
            for (const { s, value } of searchArray) {
                if (s == text) {
                    result.push(value);
                }
            }
            for (const { s, value } of searchArray) {
                if (text.includes(s) && !result.includes(value)) {
                    result.push(value);
                }
            }
            let scoredPriority = [];
            // Fuzzy match with the name.
            // This prioritizes values with consecutive letters.
            for (const { s, value } of searchArray) {
                if (result.length >= maxResults) {
                    break;
                }
                if (result.includes(value)) {
                    continue;
                }
                const name = s.toLowerCase();
                let currentStringIdx = -1;
                let score = 0;
                let scoreDelta = 1;
                for (const c of text) {
                    const nextIdx = name.indexOf(c, currentStringIdx + 1);
                    if (nextIdx == currentStringIdx + 1) {
                        scoreDelta *= 2;
                    }
                    else {
                        scoreDelta = 1;
                    }
                    score += scoreDelta;
                    currentStringIdx = nextIdx;
                    if (currentStringIdx < 0) {
                        break;
                    }
                }
                if (currentStringIdx >= 0) {
                    scoredPriority.push({ value, score });
                    continue;
                }
            }
            scoredPriority.sort((a, b) => b.score - a.score);
            for (const match of scoredPriority) {
                if (result.length > maxResults) {
                    break;
                }
                if (!result.includes(match.value)) {
                    result.push(match.value);
                }
            }
            return result;
        }
        exports.fuzzySearch = fuzzySearch;
    });
    /**
     * Rendering tools for other classes to reference.
     * These take relatively pure data and update that way.
     * TODO: Split this into files corresponding to the classes they are templated
     * for.
     * TODO: Consider making some of these into proper soy templates and then
     * compiling them here so that the structure is more consistent.
     */
    define("templates", ["require", "exports", "common", "ilmina_stripped", "fuzzy_search", "fuzzy_search_aliases"], function (require, exports, common_3, ilmina_stripped_2, fuzzy_search_1, fuzzy_search_aliases_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        // import { debug } from './debugger';
        function create(tag, cls = '') {
            const el = document.createElement(tag);
            if (cls) {
                el.className = cls;
            }
            return el;
        }
        exports.create = create;
        var ClassNames;
        (function (ClassNames) {
            ClassNames["HALF_OPACITY"] = "valeria-half-opacity";
            ClassNames["MONSTER_TYPE"] = "valeria-monster-type";
            ClassNames["LAYERED_ASSET"] = "valeria-layered-asset";
            ClassNames["ICON"] = "valeria-monster-icon";
            ClassNames["ICON_SELECTED"] = "valeria-monster-icon-selected";
            ClassNames["ICON_ATTR"] = "valeria-monster-icon-attribute";
            ClassNames["ICON_SUB"] = "valeria-monster-icon-subattribute";
            ClassNames["ICON_INFO"] = "valeria-monster-icon-info";
            ClassNames["ICON_PLUS"] = "valeria-monster-icon-plus";
            ClassNames["ICON_AWAKE"] = "valeria-monster-icon-awakening";
            ClassNames["ICON_SUPER"] = "valeria-monster-icon-sa";
            ClassNames["ICON_LEVEL"] = "valeria-monster-icon-level";
            ClassNames["ICON_ID"] = "valeria-monster-icon-id";
            ClassNames["INHERIT"] = "valeria-monster-inherit";
            ClassNames["INHERIT_ICON"] = "valeria-monster-inherit-icon";
            ClassNames["INHERIT_ATTR"] = "valeria-monster-inherit-attribute";
            ClassNames["INHERIT_SUB"] = "valeria-monster-inherit-subattribute";
            ClassNames["INHERIT_ID"] = "valeria-monster-inherit-id";
            ClassNames["INHERIT_LEVEL"] = "valeria-monster-inherit-level";
            ClassNames["INHERIT_PLUS"] = "valeria-monster-inherit-plus";
            ClassNames["MONSTER_LATENTS"] = "valeria-monster-latents";
            ClassNames["MONSTER_LATENT"] = "valeria-monster-latent";
            ClassNames["MONSTER_LATENT_SUPER"] = "valeria-monster-latent-super";
            ClassNames["MONSTER_LATENT_HYPER"] = "valeria-monster-latent-hyper";
            ClassNames["COMBO_EDITOR"] = "valeria-combo-editor";
            ClassNames["COMBO_COMMAND"] = "valeria-combo-command";
            ClassNames["COMBO_TABLE"] = "valeria-combo-table";
            ClassNames["COMBO_ORB"] = "valeria-combo-orb";
            ClassNames["TABBED"] = "valeria-tabbed";
            ClassNames["TABBED_LABEL"] = "valeria-tabbed-label";
            ClassNames["TABBED_LABEL_SELECTED"] = "valeria-tabbed-label-selected";
            ClassNames["TABBED_TAB"] = "valeria-tabbed-tab";
            ClassNames["TABBED_TAB_SELECTED"] = "valeria-tabbed-tab-selected";
            ClassNames["TEAM_STORAGE"] = "valeria-team-storage";
            ClassNames["TEAM_STORAGE_SAVE"] = "valeria-team-storage-save";
            ClassNames["TEAM_STORAGE_LOAD_AREA"] = "valeria-team-load-area";
            ClassNames["TEAM_STORAGE_LOAD_ACTIVE"] = "valeria-team-load-active";
            ClassNames["TEAM_STORAGE_LOAD_INACTIVE"] = "valeria-team-load-inactive";
            ClassNames["STAT_TABLE"] = "valeria-team-stat-table";
            ClassNames["STAT_LABEL"] = "valeria-team-stat-label";
            ClassNames["STAT_VALUE"] = "valeria-team-stat-value";
            ClassNames["STAT_TOTAL_VALUE"] = "valeria-team-stat-total-value";
            ClassNames["AWAKENING_TABLE"] = "valeria-team-awakening-table";
            ClassNames["HP_DIV"] = "valeria-hp";
            ClassNames["HP_SLIDER"] = "valeria-hp-slider";
            ClassNames["HP_INPUT"] = "valeria-hp-input";
            ClassNames["HP_MAX"] = "valeria-hp-max";
            ClassNames["HP_PERCENT"] = "valeria-hp-percent";
            ClassNames["TEAM_CONTAINER"] = "valeria-team-container";
            ClassNames["BADGE"] = "valeria-team-badge";
            ClassNames["MONSTER_CONTAINER"] = "valeria-monster-container";
            ClassNames["MONSTER_CONTAINER_SELECTED"] = "valeria-monster-container-selected";
            ClassNames["MONSTER_CLICKED"] = "valeria-monster-clicked";
            ClassNames["TEAM_TITLE"] = "valeria-team-title";
            ClassNames["TEAM_DESCRIPTION"] = "valeria-team-description";
            ClassNames["MONSTER_SELECTOR"] = "valeria-monster-selector";
            ClassNames["PLAYER_MODE_SELECTOR"] = "valeria-player-mode-selector";
            ClassNames["SELECTOR_OPTIONS_CONTAINER"] = "valeria-monster-selector-options-container";
            ClassNames["SELECTOR_OPTIONS_INACTIVE"] = "valeria-monster-selector-options-inactive";
            ClassNames["SELECTOR_OPTIONS_ACTIVE"] = "valeria-monster-selector-options-active";
            ClassNames["SELECTOR_OPTION_INACTIVE"] = "valeria-monster-selector-option-inactive";
            ClassNames["SELECTOR_OPTION_ACTIVE"] = "valeria-monster-selector-option-active";
            ClassNames["MONSTER_EDITOR"] = "valeria-monster-editor";
            ClassNames["PDCHU_IO"] = "valeria-pdchu-io";
            ClassNames["LEVEL_EDITOR"] = "valeria-level-editor";
            ClassNames["LEVEL_INPUT"] = "valeria-level-input";
            ClassNames["PLUS_EDITOR"] = "valeria-plus-editor";
            ClassNames["AWAKENING"] = "valeria-monster-awakening";
            ClassNames["AWAKENING_SUPER"] = "valeria-monster-awakening-super";
            ClassNames["AWAKENING_HYPER"] = "valeria-monster-awakening-hyper";
            ClassNames["CHANGE_AREA"] = "valeria-change-area";
            ClassNames["SWAP_ICON"] = "valeria-swap-icon";
            ClassNames["TRANSFORM_ICON"] = "valeria-transform-icon";
            ClassNames["DAMAGE_TABLE"] = "valeria-team-damage-table";
            ClassNames["ENEMY_PICTURE"] = "valeria-enemy-picture-container";
            ClassNames["DUNGEON_EDITOR_FLOORS"] = "valeria-dungeon-edit-floors";
            ClassNames["FLOOR_NAME"] = "valeria-floor-name";
            ClassNames["FLOOR_CONTAINER"] = "valeria-floor-container";
            ClassNames["FLOOR_ADD"] = "valeria-floor-add";
            ClassNames["FLOOR_DELETE"] = "valeria-floor-delete";
            ClassNames["FLOOR_ENEMIES"] = "valeria-floor-enemies";
            ClassNames["FLOOR_ENEMY"] = "valeria-floor-enemy";
            ClassNames["FLOOR_ENEMY_ADD"] = "valeria-floor-enemy-add";
            ClassNames["FLOOR_ENEMY_DELETE"] = "valeria-floor-delete";
            ClassNames["ENEMY_STAT_TABLE"] = "valeria-enemy-stat-table";
            ClassNames["ENEMY_SKILL_AREA"] = "valeria-enemy-skill-area";
            ClassNames["SETTINGS"] = "valeria-settings";
            ClassNames["SETTINGS_CONTENT"] = "valeria-settings-content";
            ClassNames["SETTINGS_CLOSE"] = "valeria-settings-close";
            ClassNames["VALERIA"] = "valeria";
        })(ClassNames || (ClassNames = {}));
        exports.ClassNames = ClassNames;
        // enum Ids {
        //   COMBO_TABLE_PREFIX = 'valeria-combo-table-',
        // }
        var StatIndex;
        (function (StatIndex) {
            StatIndex[StatIndex["HP"] = 0] = "HP";
            StatIndex[StatIndex["ATK"] = 1] = "ATK";
            StatIndex[StatIndex["RCV"] = 2] = "RCV";
            StatIndex[StatIndex["CD"] = 3] = "CD";
        })(StatIndex || (StatIndex = {}));
        const TEAM_SCALING = 0.6;
        function show(el) {
            el.style.visibility = 'visible';
        }
        function hide(el) {
            el.style.visibility = 'hidden';
        }
        function superShow(el) {
            el.style.display = '';
            show(el);
        }
        function superHide(el) {
            el.style.display = 'none';
            hide(el);
        }
        function getAwakeningOffsets(awakeningNumber) {
            const result = [-2, -360];
            if (awakeningNumber < 0 || awakeningNumber > 81) {
                console.warn('Invalid awakening, returning unknown.');
                return result;
            }
            result[0] -= (awakeningNumber % 11) * 36;
            result[1] -= Math.floor(awakeningNumber / 11) * 36;
            return result;
        }
        exports.getAwakeningOffsets = getAwakeningOffsets;
        function updateAwakening(el, awakening, scale, unavailableReason = '') {
            const [x, y] = getAwakeningOffsets(awakening);
            el.style.backgroundPosition = `${x * scale}px ${y * scale}px`;
            el.style.opacity = `${unavailableReason ? 0.5 : 1}`;
            el.title = unavailableReason;
        }
        var AssetEnum;
        (function (AssetEnum) {
            AssetEnum[AssetEnum["NUMBER_0"] = 0] = "NUMBER_0";
            AssetEnum[AssetEnum["NUMBER_1"] = 1] = "NUMBER_1";
            AssetEnum[AssetEnum["NUMBER_2"] = 2] = "NUMBER_2";
            AssetEnum[AssetEnum["NUMBER_3"] = 3] = "NUMBER_3";
            AssetEnum[AssetEnum["NUMBER_4"] = 4] = "NUMBER_4";
            AssetEnum[AssetEnum["NUMBER_5"] = 5] = "NUMBER_5";
            AssetEnum[AssetEnum["NUMBER_6"] = 6] = "NUMBER_6";
            AssetEnum[AssetEnum["NUMBER_7"] = 7] = "NUMBER_7";
            AssetEnum[AssetEnum["NUMBER_8"] = 8] = "NUMBER_8";
            AssetEnum[AssetEnum["NUMBER_9"] = 9] = "NUMBER_9";
            AssetEnum[AssetEnum["GUARD_BREAK"] = 10] = "GUARD_BREAK";
            AssetEnum[AssetEnum["TIME"] = 11] = "TIME";
            AssetEnum[AssetEnum["POISON"] = 12] = "POISON";
            AssetEnum[AssetEnum["ENRAGE"] = 13] = "ENRAGE";
            AssetEnum[AssetEnum["STATUS_SHIELD"] = 14] = "STATUS_SHIELD";
            AssetEnum[AssetEnum["TIME_BUFF"] = 15] = "TIME_BUFF";
            AssetEnum[AssetEnum["TIME_DEBUFF"] = 16] = "TIME_DEBUFF";
            AssetEnum[AssetEnum["RESOLVE"] = 17] = "RESOLVE";
            AssetEnum[AssetEnum["BURST"] = 18] = "BURST";
            AssetEnum[AssetEnum["DEF_OVERLAY"] = 19] = "DEF_OVERLAY";
            AssetEnum[AssetEnum["FIXED_HP"] = 20] = "FIXED_HP";
            AssetEnum[AssetEnum["AWOKEN_BIND"] = 21] = "AWOKEN_BIND";
            AssetEnum[AssetEnum["SKILL_BIND"] = 22] = "SKILL_BIND";
            AssetEnum[AssetEnum["INVINCIBLE"] = 23] = "INVINCIBLE";
            AssetEnum[AssetEnum["SHIELD_BASE"] = 24] = "SHIELD_BASE";
            AssetEnum[AssetEnum["PLAYER_HP_LEFT"] = 25] = "PLAYER_HP_LEFT";
            AssetEnum[AssetEnum["PLAYER_HP_MIDDLE"] = 26] = "PLAYER_HP_MIDDLE";
            AssetEnum[AssetEnum["PLAYER_HP_RIGHT"] = 27] = "PLAYER_HP_RIGHT";
            AssetEnum[AssetEnum["ENEMY_HP_LEFT"] = 28] = "ENEMY_HP_LEFT";
            AssetEnum[AssetEnum["ENEMY_HP_MIDDLE"] = 29] = "ENEMY_HP_MIDDLE";
            AssetEnum[AssetEnum["ENEMY_HP_RIGHT"] = 30] = "ENEMY_HP_RIGHT";
            // Overlays SHIELD_BASE for attribute resists.
            AssetEnum[AssetEnum["FIRE_TRANSPARENT"] = 31] = "FIRE_TRANSPARENT";
            AssetEnum[AssetEnum["WATER_TRANSPARENT"] = 32] = "WATER_TRANSPARENT";
            AssetEnum[AssetEnum["WOOD_TRANSPARENT"] = 33] = "WOOD_TRANSPARENT";
            AssetEnum[AssetEnum["LIGHT_TRANSPARENT"] = 34] = "LIGHT_TRANSPARENT";
            AssetEnum[AssetEnum["DARK_TRANSPARENT"] = 35] = "DARK_TRANSPARENT";
            AssetEnum[AssetEnum["COMBO_ABSORB"] = 36] = "COMBO_ABSORB";
            // Overlays [attr]_TRANSPARENT for attribute absorb.
            AssetEnum[AssetEnum["TWINKLE"] = 37] = "TWINKLE";
            // Overlays SHIELD_BASE for Damage Void.
            AssetEnum[AssetEnum["VOID_OVERLAY"] = 38] = "VOID_OVERLAY";
            // Overlays SHIELD_BASES for Damage Absorb.
            AssetEnum[AssetEnum["ABSORB_OVERLAY"] = 39] = "ABSORB_OVERLAY";
            // DAMAGE_NULL,
            AssetEnum[AssetEnum["SWAP"] = 40] = "SWAP";
            AssetEnum[AssetEnum["TRANSFROM"] = 41] = "TRANSFROM";
            // Overlays absorbs and voids as player buffs..
            AssetEnum[AssetEnum["VOID"] = 42] = "VOID";
            AssetEnum[AssetEnum["COLOR_WHEEL"] = 43] = "COLOR_WHEEL";
        })(AssetEnum || (AssetEnum = {}));
        exports.AssetEnum = AssetEnum;
        const ASSET_INFO = new Map([
            [AssetEnum.NUMBER_0, { offsetX: 186, offsetY: 180, width: 19, height: 25 }],
            [AssetEnum.NUMBER_1, { offsetX: 217, offsetY: 180, width: 14, height: 25 }],
            [AssetEnum.NUMBER_2, { offsetX: 247, offsetY: 180, width: 19, height: 25 }],
            [AssetEnum.NUMBER_3, { offsetX: 279, offsetY: 180, width: 18, height: 26 }],
            [AssetEnum.NUMBER_4, { offsetX: 310, offsetY: 180, width: 20, height: 25 }],
            [AssetEnum.NUMBER_5, { offsetX: 343, offsetY: 180, width: 18, height: 25 }],
            [AssetEnum.NUMBER_6, { offsetX: 374, offsetY: 180, width: 19, height: 25 }],
            [AssetEnum.NUMBER_7, { offsetX: 407, offsetY: 180, width: 18, height: 25 }],
            [AssetEnum.NUMBER_8, { offsetX: 438, offsetY: 180, width: 19, height: 25 }],
            [AssetEnum.NUMBER_9, { offsetX: 470, offsetY: 180, width: 20, height: 25 }],
            [AssetEnum.GUARD_BREAK, { offsetY: 1, offsetX: 3, width: 34, height: 30 }],
            [AssetEnum.TIME, { offsetY: 0, offsetX: 2 + 36 * 1, width: 36, height: 36 }],
            [AssetEnum.POISON, { offsetY: 0, offsetX: 2 + 36 * 2, width: 36, height: 36 }],
            [AssetEnum.ENRAGE, { offsetY: 0, offsetX: 116, width: 32, height: 32 }],
            [AssetEnum.STATUS_SHIELD, { offsetY: 1, offsetX: 156, width: 32, height: 29 }],
            [AssetEnum.SKILL_BIND, { offsetY: 40, offsetX: 141, width: 32, height: 32 }],
            [AssetEnum.AWOKEN_BIND, { offsetY: 73, offsetX: 140, width: 32, height: 32 }],
            [AssetEnum.RESOLVE, { offsetY: 144, offsetX: 132, width: 32, height: 32 }],
            [AssetEnum.BURST, { offsetY: 208, offsetX: 132, width: 32, height: 32 }],
            [AssetEnum.SHIELD_BASE, { offsetY: 55, offsetX: 327, width: 34, height: 34 }],
            [AssetEnum.FIRE_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 0, width: 32, height: 32 }],
            [AssetEnum.WATER_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 1, width: 32, height: 32 }],
            [AssetEnum.WOOD_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 2, width: 32, height: 32 }],
            [AssetEnum.LIGHT_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 3, width: 32, height: 32 }],
            [AssetEnum.DARK_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 4, width: 32, height: 32 }],
            [AssetEnum.TWINKLE, { offsetY: 248, offsetX: 85, width: 36, height: 36 }],
            [AssetEnum.VOID_OVERLAY, { offsetY: 49, offsetX: 372, width: 32, height: 32 }],
            [AssetEnum.ABSORB_OVERLAY, { offsetY: 49, offsetX: 452, width: 32, height: 32 }],
            [AssetEnum.FIXED_HP, { offsetY: 256, offsetX: 131, width: 32, height: 32 }],
            [AssetEnum.SWAP, { offsetY: 84, offsetX: 376, width: 23, height: 25 }],
            [AssetEnum.TRANSFROM, { offsetY: 84, offsetX: 485, width: 23, height: 25 }],
            [AssetEnum.VOID, { offsetY: 90, offsetX: 416, width: 19, height: 18 }],
            [AssetEnum.COLOR_WHEEL, { offsetY: 208, offsetX: 131, width: 32, height: 32 }],
            [AssetEnum.INVINCIBLE, { offsetY: 241, offsetX: 314, width: 28, height: 30 }],
            [AssetEnum.COMBO_ABSORB, { offsetY: 113, offsetX: 133, width: 30, height: 30 }],
        ]);
        const UI_ASSET_SRC = `url(${common_3.BASE_URL}assets/UIPAT1.PNG)`;
        const INITIAL_SETTINGS = JSON.parse(window.localStorage.valeriaSettings || '{"b": {}, "n": {}}');
        class Settings {
            constructor() {
                this.el = create('div', ClassNames.SETTINGS);
                this.content = create('div', ClassNames.SETTINGS_CONTENT);
                this.table = create('table');
                this.openButton = create('button');
                this.closeButton = create('div', ClassNames.SETTINGS_CLOSE);
                this.boolSettings = new Map();
                this.numberSettings = new Map();
                this.boolEls = new Map();
                this.numberEls = new Map();
                this.el.appendChild(this.content);
                const header = create('h2');
                header.innerText = 'Settings';
                this.el.onclick = () => {
                    this.closeButton.click();
                };
                this.content.onclick = (e) => {
                    e.stopPropagation();
                };
                this.openButton.innerText = 'Open Settings';
                this.openButton.onclick = () => {
                    for (const key of this.boolEls.keys()) {
                        this.boolEls.get(key).checked = this.boolSettings.get(key);
                    }
                    for (const key of this.numberEls.keys()) {
                        this.numberEls.get(key).value = String(this.numberSettings.get(key));
                    }
                    this.el.style.display = 'block';
                };
                this.closeButton.innerText = '×';
                this.closeButton.onclick = () => {
                    this.el.style.display = 'none';
                };
                this.content.appendChild(this.closeButton);
                this.content.appendChild(header);
                this.content.appendChild(this.table);
                this.initNumberSetting(common_3.NumberSetting.MONSTER_LEVEL, 'Default Monster Level', 110);
                this.initNumberSetting(common_3.NumberSetting.INHERIT_LEVEL, 'Default Inherit Level', 110);
                this.initBoolSetting(common_3.BoolSetting.INHERIT_PLUSSED, 'Default Inherit to +297', true);
                this.initBoolSetting(common_3.BoolSetting.RESET_STATE, 'Reset Team State on Enemy Load', false);
                this.initBoolSetting(common_3.BoolSetting.USE_PREEMPT, 'Use Preemptive on Enemy Load', true);
                this.initBoolSetting(common_3.BoolSetting.WARN_CHANGE, 'Warn when changing teams', true);
                this.initBoolSetting(common_3.BoolSetting.WARN_CLOSE, 'Warn when closing page', true);
                this.initBoolSetting(common_3.BoolSetting.APRIL_FOOLS, 'April Fools Icons (Needs refresh)', false);
                this.initBoolSetting(common_3.BoolSetting.DEBUG_AREA, 'Show Debug Area', false);
                this.initBoolSetting(common_3.BoolSetting.SHOW_COOP_PARTNER, 'Show Coop Partner in Coop', true);
                document.body.appendChild(this.el);
            }
            getElement() {
                return this.el;
            }
            updateStorage() {
                const b = {};
                for (const key of this.boolSettings.keys()) {
                    b[key] = this.boolSettings.get(key);
                }
                const n = {};
                for (const key of this.numberSettings.keys()) {
                    n[key] = this.numberSettings.get(key);
                }
                window.localStorage.valeriaSettings = JSON.stringify({ b, n });
            }
            initBoolSetting(name, label, defaultValue) {
                if (INITIAL_SETTINGS.b && INITIAL_SETTINGS.b[name] != undefined) {
                    this.boolSettings.set(name, INITIAL_SETTINGS.b[name]);
                }
                else {
                    this.boolSettings.set(name, defaultValue);
                }
                const sectionRow = create('tr');
                const labelCell = create('td');
                labelCell.innerText = label;
                const inputCell = create('td');
                const inputEl = create('input');
                inputEl.type = 'checkbox';
                inputEl.checked = this.boolSettings.get(name);
                inputEl.onchange = () => {
                    this.setBool(name, inputEl.checked);
                };
                inputCell.appendChild(inputEl);
                sectionRow.appendChild(labelCell);
                sectionRow.appendChild(inputCell);
                this.boolEls.set(name, inputEl);
                this.table.appendChild(sectionRow);
            }
            initNumberSetting(name, label, defaultValue) {
                if (INITIAL_SETTINGS.b && INITIAL_SETTINGS.n[name] != undefined) {
                    this.numberSettings.set(name, INITIAL_SETTINGS.n[name]);
                }
                else {
                    this.numberSettings.set(name, defaultValue);
                }
                const sectionRow = create('tr');
                const labelCell = create('td');
                labelCell.innerText = label;
                const inputCell = create('td');
                const inputEl = create('input');
                inputEl.type = 'number';
                inputEl.value = String(this.numberSettings.get(name));
                inputEl.onchange = () => {
                    this.setNumber(name, Number(inputEl.value));
                };
                inputCell.appendChild(inputEl);
                sectionRow.appendChild(labelCell);
                sectionRow.appendChild(inputCell);
                this.numberEls.set(name, inputEl);
                this.table.appendChild(sectionRow);
            }
            getBool(s) {
                if (!this.boolSettings.has(s)) {
                    console.error(`Setting ${s} not defined, defaulting to false.`);
                    return false;
                }
                return this.boolSettings.get(s);
            }
            setBool(s, b) {
                if (!this.boolSettings.has(s)) {
                    console.error(`Setting ${s} not defined, not setting.`);
                    return;
                }
                this.boolSettings.set(s, b);
                this.updateStorage();
            }
            getNumber(s) {
                if (!this.numberSettings.has(s)) {
                    console.error(`Setting ${s} not defined, defaulting to -1`);
                    return -1;
                }
                return this.numberSettings.get(s);
            }
            setNumber(s, n) {
                if (!this.numberSettings.has(s)) {
                    console.error(`Setting ${s} not defined, not setting.`);
                    return;
                }
                this.numberSettings.set(s, n);
                this.updateStorage();
            }
        }
        const SETTINGS = new Settings();
        exports.SETTINGS = SETTINGS;
        ilmina_stripped_2.loadSettings(SETTINGS);
        class LayeredAsset {
            constructor(assets, onClick, active = true, scale = 1) {
                this.element = create('div', ClassNames.LAYERED_ASSET);
                this.active = true;
                this.assets = assets;
                const maxSizes = {
                    width: 0,
                    height: 0,
                };
                this.elements = assets
                    .filter((asset) => ASSET_INFO.has(asset))
                    .map((asset) => {
                    const assetInfo = ASSET_INFO.get(asset);
                    const el = create('a');
                    if (assetInfo) {
                        el.style.width = String(assetInfo.width * scale);
                        el.style.height = String(assetInfo.height * scale);
                        el.style.backgroundSize = `${512 * scale}px ${512 * scale}px`;
                        if (assetInfo.width * scale > maxSizes.width) {
                            maxSizes.width = assetInfo.width * scale;
                        }
                        if (assetInfo.height * scale > maxSizes.height) {
                            maxSizes.height = assetInfo.height * scale;
                        }
                        el.style.backgroundImage = UI_ASSET_SRC;
                        el.style.backgroundPosition = `${-1 * assetInfo.offsetX * scale} ${-1 * assetInfo.offsetY * scale}`;
                    }
                    return el;
                });
                // Manually center each of these.
                for (const el of this.elements) {
                    const elHeight = Number(el.style.height.replace('px', ''));
                    const elWidth = Number(el.style.width.replace('px', ''));
                    if (elHeight < maxSizes.height) {
                        el.style.marginTop = String((maxSizes.height - elHeight) / 2);
                    }
                    if (elWidth < maxSizes.width) {
                        el.style.marginLeft = String((maxSizes.width - elWidth) / 2);
                    }
                }
                for (const el of this.elements) {
                    this.element.appendChild(el);
                }
                this.element.style.width = String(maxSizes.width);
                this.element.style.height = String(maxSizes.height);
                this.onClick = onClick;
                this.element.onclick = () => {
                    this.onClick(!this.active);
                };
                this.setActive(active);
            }
            getElement() {
                return this.element;
            }
            getAssetPart(idx) {
                return this.elements[idx];
            }
            setActive(active) {
                this.active = active;
                if (active) {
                    for (const element of this.elements) {
                        element.classList.remove(ClassNames.HALF_OPACITY);
                    }
                }
                else {
                    for (const element of this.elements) {
                        element.classList.add(ClassNames.HALF_OPACITY);
                    }
                }
            }
        }
        exports.LayeredAsset = LayeredAsset;
        class MonsterIcon {
            constructor(hideInfoTable = false) {
                this.element = create('a', ClassNames.ICON);
                this.attributeEl = create('a', ClassNames.ICON_ATTR);
                this.subattributeEl = create('a', ClassNames.ICON_SUB);
                this.infoTable = create('table', ClassNames.ICON_INFO);
                this.hideInfoTable = false;
                this.id = -1;
                this.hideInfoTable = hideInfoTable;
                if (this.hideInfoTable) {
                    hide(this.infoTable);
                }
                const classNames = [
                    ClassNames.ICON_PLUS, ClassNames.ICON_AWAKE,
                    '', ClassNames.ICON_SUPER,
                    ClassNames.ICON_LEVEL, ClassNames.ICON_ID
                ];
                for (let i = 0; i < 3; i++) {
                    const row = create('tr');
                    for (let j = 0; j < 2; j++) {
                        const cell = create('td');
                        const className = classNames[i * 2 + j];
                        if (className) {
                            let el = create('div', className);
                            if (className == ClassNames.ICON_SUPER) {
                                el = create('a', className);
                            }
                            if (className == ClassNames.ICON_AWAKE) {
                                const numberArea = create('div');
                                const maxAwokenImage = create('img');
                                maxAwokenImage.src = 'assets/max_awoken.png';
                                superHide(numberArea);
                                superHide(maxAwokenImage);
                                el.appendChild(numberArea);
                                el.appendChild(maxAwokenImage);
                            }
                            if (this.hideInfoTable && i * 2 + j != 5) {
                                superHide(el);
                            }
                            cell.appendChild(el);
                        }
                        row.appendChild(cell);
                    }
                    this.infoTable.appendChild(row);
                }
                this.element.appendChild(this.attributeEl);
                this.attributeEl.appendChild(this.subattributeEl);
                this.element.appendChild(this.infoTable);
                const changeArea = create('div', ClassNames.CHANGE_AREA);
                this.swapIcon = new LayeredAsset([AssetEnum.SWAP], (active) => { console.log(active); }, true, 0.75);
                const swapElement = this.swapIcon.getElement();
                swapElement.classList.add(ClassNames.SWAP_ICON);
                changeArea.appendChild(swapElement);
                // this.element.appendChild(swapElement);
                hide(swapElement);
                this.transformIcon = new LayeredAsset([AssetEnum.TRANSFROM], (active) => {
                    this.onUpdate({
                        transformActive: active,
                    });
                }, false, 0.75);
                const transformElement = this.transformIcon.getElement();
                transformElement.classList.add(ClassNames.TRANSFORM_ICON);
                // this.element.appendChild(transformElement);
                changeArea.appendChild(transformElement);
                hide(transformElement);
                this.element.appendChild(changeArea);
                if (this.hideInfoTable) {
                    superHide(swapElement);
                    superHide(transformElement);
                }
                this.onUpdate = () => { };
            }
            getElement() {
                return this.element;
            }
            setOnUpdate(onUpdate) {
                this.onUpdate = onUpdate;
            }
            updateId(id) {
                this.update({
                    id,
                    plusses: 0,
                    awakening: 0,
                    superAwakeningIdx: -1,
                    unavailableReason: '',
                    level: 0,
                    showSwap: false,
                    showTransform: false,
                    activeTransform: false,
                });
            }
            update(d) {
                this.id = d.id;
                if (d.id == -1) {
                    hide(this.element);
                    hide(this.attributeEl);
                    hide(this.subattributeEl);
                    superHide(this.infoTable);
                    return;
                }
                show(this.element);
                if (!this.hideInfoTable) {
                    superShow(this.infoTable);
                }
                const card = ilmina_stripped_2.floof.getCard(d.id);
                const descriptor = ilmina_stripped_2.CardAssets.getIconImageData(card);
                if (descriptor) {
                    this.element.style.backgroundSize = `${TEAM_SCALING * descriptor.baseWidth}px ${descriptor.baseHeight * TEAM_SCALING}px`;
                    this.element.style.backgroundImage = `url(${descriptor.url})`;
                    this.element.style.backgroundPosition = `-${descriptor.offsetX * TEAM_SCALING}px -${descriptor.offsetY * TEAM_SCALING}`;
                }
                const attrDescriptor = ilmina_stripped_2.CardUiAssets.getIconFrame(card.attribute, false, ilmina_stripped_2.floof.getModel());
                if (attrDescriptor) {
                    show(this.attributeEl);
                    this.attributeEl.style.backgroundImage = `url(${attrDescriptor.url})`;
                    this.attributeEl.style.backgroundPosition = `-${attrDescriptor.offsetX * TEAM_SCALING}px -${attrDescriptor.offsetY * TEAM_SCALING}px`;
                }
                else {
                    hide(this.attributeEl);
                }
                const subDescriptor = ilmina_stripped_2.CardUiAssets.getIconFrame(card.subattribute, true, ilmina_stripped_2.floof.getModel());
                if (subDescriptor) {
                    show(this.subattributeEl);
                    this.subattributeEl.style.backgroundImage = `url(${subDescriptor.url})`;
                    this.subattributeEl.style.backgroundPosition = `-${subDescriptor.offsetX * TEAM_SCALING}px -${subDescriptor.offsetY * TEAM_SCALING}px`;
                }
                else {
                    hide(this.subattributeEl);
                }
                const plusEl = this.element.getElementsByClassName(ClassNames.ICON_PLUS)[0];
                if (d.plusses) {
                    show(plusEl);
                    plusEl.innerText = `+${d.plusses}`;
                }
                else {
                    hide(plusEl);
                }
                const awakeningEl = this.element.getElementsByClassName(ClassNames.ICON_AWAKE)[0];
                if (d.awakening != 0) {
                    show(awakeningEl);
                    const maxAwokenImage = awakeningEl.getElementsByTagName('img')[0];
                    const numberArea = awakeningEl.getElementsByTagName('div')[0];
                    if (d.awakening >= ilmina_stripped_2.floof.getCard(d.id).awakenings.length || d.activeTransform) {
                        superShow(maxAwokenImage);
                        superHide(numberArea);
                    }
                    else {
                        superHide(maxAwokenImage);
                        superShow(numberArea);
                        numberArea.innerText = `(${d.awakening})`;
                    }
                }
                else {
                    hide(awakeningEl);
                }
                const superAwakeningEl = this.element.getElementsByClassName(ClassNames.ICON_SUPER)[0];
                if (d.superAwakeningIdx >= 0) {
                    show(superAwakeningEl);
                    updateAwakening(superAwakeningEl, card.superAwakenings[d.superAwakeningIdx], 0.5, d.unavailableReason);
                }
                else {
                    hide(superAwakeningEl);
                }
                const levelEl = this.element.getElementsByClassName(ClassNames.ICON_LEVEL)[0];
                levelEl.innerText = `Lv${d.level}`;
                const idEl = this.element.getElementsByClassName(ClassNames.ICON_ID)[0];
                idEl.innerText = `${d.id}`;
                (d.showSwap ? show : hide)(this.swapIcon.getElement());
                (d.showTransform ? show : hide)(this.transformIcon.getElement());
                this.transformIcon.setActive(d.activeTransform);
            }
        }
        exports.MonsterIcon = MonsterIcon;
        class MonsterInherit {
            constructor() {
                this.element = create('table', ClassNames.INHERIT);
                this.icon = create('a', ClassNames.INHERIT_ICON);
                this.attr = create('a', ClassNames.INHERIT_ATTR);
                this.sub = create('a', ClassNames.INHERIT_SUB);
                this.idEl = create('div', ClassNames.INHERIT_ID);
                this.levelEl = create('div', ClassNames.INHERIT_LEVEL);
                this.plusEl = create('div', ClassNames.INHERIT_PLUS);
                const row = create('tr');
                const iconCell = create('td');
                this.icon.appendChild(this.attr);
                this.attr.appendChild(this.sub);
                iconCell.appendChild(this.icon);
                row.appendChild(iconCell);
                const detailCell = create('td');
                detailCell.appendChild(this.idEl);
                detailCell.appendChild(create('br'));
                detailCell.appendChild(this.levelEl);
                detailCell.appendChild(create('br'));
                detailCell.appendChild(this.plusEl);
                row.appendChild(detailCell);
                this.element.appendChild(row);
            }
            getElement() {
                return this.element;
            }
            update(id, level, plussed) {
                if (id == -1) {
                    hide(this.element);
                    hide(this.icon);
                    hide(this.attr);
                    hide(this.sub);
                    hide(this.idEl);
                    hide(this.levelEl);
                    hide(this.plusEl);
                    return;
                }
                const card = ilmina_stripped_2.floof.getCard(id);
                const desInherit = ilmina_stripped_2.CardAssets.getIconImageData(card);
                if (desInherit) {
                    show(this.icon);
                    this.icon.style.backgroundImage = `url(${desInherit.url})`;
                    this.icon.style.backgroundSize = `${desInherit.baseWidth / 2 * TEAM_SCALING}px ${desInherit.baseHeight / 2 * TEAM_SCALING}px`;
                    this.icon.style.backgroundPosition = `-${desInherit.offsetX / 2 * TEAM_SCALING}px -${desInherit.offsetY / 2 * TEAM_SCALING}px`;
                }
                else {
                    hide(this.icon);
                }
                const desAttr = ilmina_stripped_2.CardUiAssets.getIconFrame(card.attribute, false, ilmina_stripped_2.floof.getModel());
                if (desAttr) {
                    show(this.attr);
                    this.attr.style.backgroundImage = `url(${desAttr.url})`;
                    this.attr.style.backgroundPosition = `-${desAttr.offsetX / 2 * TEAM_SCALING}px -${desAttr.offsetY / 2 * TEAM_SCALING}px`;
                }
                else {
                    hide(this.attr);
                }
                const desSub = ilmina_stripped_2.CardUiAssets.getIconFrame(card.subattribute, true, ilmina_stripped_2.floof.getModel());
                if (desSub) {
                    show(this.attr);
                    this.sub.style.backgroundImage = `url(${desSub.url})`;
                    this.sub.style.backgroundPosition = `-${desSub.offsetX / 2 * TEAM_SCALING}px -${desSub.offsetY / 2 * TEAM_SCALING}px`;
                }
                else {
                    hide(this.sub);
                }
                show(this.idEl);
                show(this.levelEl);
                show(this.plusEl);
                this.idEl.innerText = `${id}`;
                this.levelEl.innerText = `Lv${level}`;
                this.plusEl.innerText = plussed ? '+297' : '+0';
            }
        }
        exports.MonsterInherit = MonsterInherit;
        class MonsterLatent {
            constructor() {
                this.el = create('div', ClassNames.MONSTER_LATENTS);
                this.latentEls = [];
                for (let i = 0; i < 8; i++) {
                    const latentEl = create('a', ClassNames.MONSTER_LATENT);
                    this.latentEls.push(latentEl);
                    this.el.appendChild(latentEl);
                }
            }
            getElement() {
                return this.el;
            }
            update(latents) {
                const scale = TEAM_SCALING * 0.43;
                for (let i = 0; i < 8; i++) {
                    if (i >= latents.length) {
                        hide(this.latentEls[i]);
                        continue;
                    }
                    show(this.latentEls[i]);
                    if (latents[i] < 11) {
                        this.latentEls[i].className = ClassNames.MONSTER_LATENT;
                    }
                    else if (latents[i] < 33) {
                        this.latentEls[i].className = ClassNames.MONSTER_LATENT_SUPER;
                    }
                    else {
                        this.latentEls[i].className = ClassNames.MONSTER_LATENT_HYPER;
                    }
                    const { x, y } = getLatentPosition(latents[i]);
                    this.latentEls[i].style.backgroundPosition = `-${x * scale}px -${y * scale}px`;
                }
            }
        }
        exports.MonsterLatent = MonsterLatent;
        class ComboPiece {
            constructor(attribute, shape = common_3.Shape.AMORPHOUS, count = 0, boardWidth = 6) {
                this.element = create('div');
                this.element.style.display = 'inline-block';
                this.element.style.margin = '5px';
                const srcName = `assets/orb${attribute}.png`;
                let positions = [];
                if (shape == common_3.Shape.CROSS) {
                    positions = [
                        [1],
                        [0, 1, 2],
                        [1],
                    ];
                }
                if (shape == common_3.Shape.COLUMN) {
                    for (let i = 0; i < count; i++) {
                        positions[i] = [0];
                    }
                }
                else if (shape == common_3.Shape.L) {
                    positions = [
                        [0],
                        [0],
                        [0, 1, 2],
                    ];
                }
                else if (shape == common_3.Shape.BOX) {
                    positions = [
                        [0, 1, 2],
                        [0, 1, 2],
                        [0, 1, 2],
                    ];
                }
                else {
                    let width = shape == common_3.Shape.ROW ? boardWidth : boardWidth - 1;
                    let remainder = count;
                    let vertical = 0;
                    while (remainder > 0) {
                        let toAdd = width;
                        if (toAdd > remainder) {
                            toAdd = remainder;
                        }
                        positions[vertical] = new Array(toAdd);
                        for (let i = 0; i < toAdd; i++) {
                            positions[vertical][i] = i;
                        }
                        remainder -= toAdd;
                        vertical++;
                    }
                }
                const height = Object.keys(positions).length;
                const width = Math.max(...Object.values(positions).map(p => p.length));
                this.element.style.width = `${width * (ComboPiece.width + 2)}px`;
                this.element.style.height = `${height * (ComboPiece.width + 2)}px`;
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const orb = ComboPiece.makeOrb(srcName);
                        if (!positions[y].includes(x)) {
                            orb.style.opacity = '0';
                        }
                        this.element.appendChild(orb);
                    }
                }
            }
            static makeOrb(src) {
                const img = create('img', ClassNames.COMBO_ORB);
                img.src = src;
                return img;
            }
            getElement() {
                return this.element;
            }
        }
        ComboPiece.width = 20;
        class ComboEditor {
            constructor() {
                this.commandInput = create('input', ClassNames.COMBO_COMMAND);
                this.element = create('div', ClassNames.COMBO_EDITOR);
                this.totalCombo = create('div');
                this.plusComboLeaderInput = create('input');
                this.plusComboActiveInput = create('input');
                this.plusComboOrbInput = create('input');
                this.boardWidthInput = create('select');
                this.pieceArea = create('div');
                this.remainingOrbInput = create('input');
                this.onComboClick = () => { };
                this.commandInput.placeholder = 'Combo Commands';
                const guideAnchor = create('a');
                guideAnchor.href = 'https://github.com/mtkwock/Valeria#command-editor-syntax';
                guideAnchor.innerText = 'Combo Command Usage Guide';
                guideAnchor.target = '_blank';
                this.totalCombo.innerText = 'Total Combos: 0';
                const tbl = create('table');
                const plusComboLeaderRow = create('tr');
                const plusComboLeaderLabel = create('td');
                plusComboLeaderLabel.innerText = '+Combo (Leader)';
                const plusComboLeaderCell = create('td');
                this.plusComboLeaderInput.type = 'number';
                this.plusComboLeaderInput.value = '0';
                this.plusComboLeaderInput.disabled = true;
                plusComboLeaderCell.appendChild(this.plusComboLeaderInput);
                plusComboLeaderRow.appendChild(plusComboLeaderLabel);
                plusComboLeaderRow.appendChild(plusComboLeaderCell);
                const plusComboActiveRow = create('tr');
                const plusComboActiveLabel = create('td');
                plusComboActiveLabel.innerText = '+Combo (Active)';
                this.plusComboActiveInput.type = 'number';
                this.plusComboActiveInput.value = '0';
                const plusComboActiveCell = create('td');
                plusComboActiveCell.appendChild(this.plusComboActiveInput);
                plusComboActiveRow.appendChild(plusComboActiveLabel);
                plusComboActiveRow.appendChild(plusComboActiveCell);
                const plusComboOrbRow = create('tr');
                const plusComboOrbLabel = create('td');
                plusComboOrbLabel.innerText = '+Combo (Awakening)';
                const plusComboOrbCell = create('td');
                this.plusComboOrbInput.type = 'number';
                this.plusComboOrbInput.value = '0';
                this.plusComboOrbInput.disabled = true;
                plusComboOrbCell.appendChild(this.plusComboOrbInput);
                plusComboOrbRow.appendChild(plusComboOrbLabel);
                plusComboOrbRow.appendChild(plusComboOrbCell);
                const remainingOrbRow = create('tr');
                const remainingOrbLabel = create('td');
                remainingOrbLabel.innerText = 'Orbs Remaining';
                this.remainingOrbInput.type = 'number';
                this.remainingOrbInput.value = '-1';
                this.remainingOrbInput.disabled = true;
                const remainingOrbCell = create('td');
                remainingOrbCell.appendChild(this.remainingOrbInput);
                remainingOrbRow.appendChild(remainingOrbLabel);
                remainingOrbRow.appendChild(remainingOrbCell);
                const boardWidthRow = create('tr');
                const boardWidthLabel = create('td');
                boardWidthLabel.innerText = 'Board Width';
                this.boardWidthInput.value = '';
                for (let i = 0; i < 4; i++) {
                    let width = i + 4;
                    const option = create('option');
                    option.value = width.toString(10);
                    option.innerText = `${width}x${width - 1}`;
                    if (i == 0) {
                        option.value = '0';
                        option.innerText = 'Auto';
                    }
                    this.boardWidthInput.appendChild(option);
                }
                const boardWidthCell = create('td');
                boardWidthCell.appendChild(this.boardWidthInput);
                boardWidthRow.appendChild(boardWidthLabel);
                boardWidthRow.appendChild(boardWidthCell);
                tbl.appendChild(plusComboLeaderRow);
                tbl.appendChild(plusComboActiveRow);
                tbl.appendChild(plusComboOrbRow);
                tbl.appendChild(remainingOrbRow);
                tbl.appendChild(boardWidthRow);
                this.element.appendChild(guideAnchor);
                this.element.appendChild(this.commandInput);
                this.element.appendChild(tbl);
                this.element.appendChild(this.totalCombo);
                this.element.appendChild(this.pieceArea);
            }
            getElement() {
                return this.element;
            }
            getInputElements() {
                const out = {};
                return out;
            }
            update(data, boardWidth, remainingOrbs) {
                this.remainingOrbInput.value = remainingOrbs.toString(10);
                while (this.pieceArea.firstChild) {
                    this.pieceArea.removeChild(this.pieceArea.firstChild);
                }
                for (const c in data) {
                    const vals = data[c];
                    for (let i = 0; i < vals.length; i++) {
                        const { shapeCount } = vals[i];
                        let shape;
                        let count;
                        if (shapeCount.startsWith('R')) {
                            shape = common_3.Shape.ROW;
                            count = parseInt(shapeCount.slice(1));
                        }
                        else if (shapeCount.startsWith('C')) {
                            shape = common_3.Shape.COLUMN;
                            count = parseInt(shapeCount.slice(1));
                        }
                        else if (shapeCount.match(/^\d+$/)) {
                            shape = common_3.Shape.AMORPHOUS;
                            count = parseInt(shapeCount);
                        }
                        else {
                            shape = common_3.LetterToShape[shapeCount[0]];
                            count = 0;
                        }
                        const comboPiece = new ComboPiece(common_3.COLORS.indexOf(c), shape, count, boardWidth);
                        this.pieceArea.appendChild(comboPiece.getElement());
                        comboPiece.getElement().onclick = () => this.onComboClick(c, i);
                    }
                    if (vals.length) {
                        this.pieceArea.appendChild(create('br'));
                    }
                }
            }
        }
        exports.ComboEditor = ComboEditor;
        ComboEditor.maxVisibleCombos = 16;
        class TabbedComponent {
            constructor(tabNames, defaultTab = '') {
                if (!tabNames.length) {
                    throw 'Need at least one tab name.';
                }
                if (!defaultTab || !tabNames.some((name) => name == defaultTab)) {
                    defaultTab = tabNames[0];
                }
                this.element = create('div', ClassNames.TABBED);
                this.tabNames = [...tabNames];
                const labelTable = create('table');
                const labelRow = create('tr');
                labelTable.appendChild(labelRow);
                this.element.appendChild(labelTable);
                this.labels = {};
                this.tabs = {};
                for (const tabName of tabNames) {
                    const labelClassName = tabName == defaultTab ? ClassNames.TABBED_LABEL_SELECTED : ClassNames.TABBED_LABEL;
                    const label = create('td', labelClassName);
                    label.innerText = tabName;
                    label.onclick = () => this.setActiveTab(tabName);
                    labelRow.appendChild(label);
                    this.labels[tabName] = label;
                    const tabClassName = tabName == defaultTab ? ClassNames.TABBED_TAB_SELECTED : ClassNames.TABBED_TAB;
                    const tab = create('div', tabClassName);
                    this.element.appendChild(tab);
                    this.tabs[tabName] = tab;
                }
            }
            getElement() {
                return this.element;
            }
            getTabLabel(tabName) {
                return this.labels[tabName];
            }
            setActiveTab(activeTabName) {
                for (const tabName of this.tabNames) {
                    if (tabName == activeTabName) {
                        this.labels[tabName].className = ClassNames.TABBED_LABEL_SELECTED;
                        this.tabs[tabName].className = ClassNames.TABBED_TAB_SELECTED;
                    }
                    else {
                        this.labels[tabName].className = ClassNames.TABBED_LABEL;
                        this.tabs[tabName].className = ClassNames.TABBED_TAB;
                    }
                }
            }
            getTab(tabName) {
                if (!(tabName in this.tabs)) {
                    throw 'Invalid tab name: ' + tabName;
                }
                return this.tabs[tabName];
            }
        }
        exports.TabbedComponent = TabbedComponent;
        class GenericSelector {
            constructor(searchArray, updateCb, aliases = {}) {
                this.el = create('div');
                this.selector = create('input', ClassNames.MONSTER_SELECTOR);
                this.optionsContainer = create('div', ClassNames.SELECTOR_OPTIONS_INACTIVE);
                this.options = [];
                this.selectedOption = 0;
                this.activeOptions = 0;
                this.aliases = {};
                this.searchArray = searchArray;
                this.updateCb = updateCb;
                this.aliases = aliases;
                this.selector.placeholder = 'Search';
                this.selector.onkeydown = this.onKeyDown();
                this.selector.onkeyup = this.onKeyUp();
                this.selector.onfocus = () => { this.selector.select(); };
                this.el.appendChild(this.selector);
                const container = create('div', ClassNames.SELECTOR_OPTIONS_CONTAINER);
                container.appendChild(this.optionsContainer);
                for (let i = 0; i < GenericSelector.MAX_OPTIONS; i++) {
                    const option = create('div', ClassNames.SELECTOR_OPTION_INACTIVE);
                    option.setAttribute('value', '-1');
                    option.onclick = this.optionOnClick(option);
                    this.optionsContainer.appendChild(option);
                    this.options.push(option);
                }
                this.el.appendChild(container);
            }
            onKeyDown() {
                return (e) => {
                    this.options[this.selectedOption].style.border = '';
                    switch (e.keyCode) {
                        case 27: // Escape key
                            this.selectedOption = 0;
                            this.optionsContainer.className = ClassNames.SELECTOR_OPTIONS_INACTIVE;
                            return;
                        case 13: // Enter
                            this.options[this.selectedOption].click();
                            return;
                        case 38: // Up Arrow
                            if (this.selectedOption > 0) {
                                this.selectedOption--;
                            }
                            this.options[this.selectedOption].style.border = '1px solid white';
                            // this.options[this.selectedOption].style.border = '1px solid white';
                            e.preventDefault();
                            return;
                        case 40: // Down Arrow
                            if (this.selectedOption < this.activeOptions - 1) {
                                this.selectedOption++;
                            }
                            this.options[this.selectedOption].style.border = '1px solid white';
                            e.preventDefault();
                            return;
                    }
                    // Left and right arrows.
                    if (e.keyCode != 37 && e.keyCode != 39) {
                        this.selectedOption = 0;
                    }
                    this.options[this.selectedOption].style.border = '1px solid white';
                };
            }
            postFilter(matches) {
                return matches;
            }
            getFuzzyMatches(text) {
                return fuzzy_search_1.fuzzySearch(text, GenericSelector.MAX_OPTIONS * 3, this.searchArray, this.aliases);
            }
            onKeyUp() {
                return (e) => {
                    this.options[this.selectedOption].style.border = '1px solid white';
                    if ([27, 13, 38, 40].indexOf(e.keyCode) >= 0) {
                        return;
                    }
                    this.optionsContainer.className = ClassNames.SELECTOR_OPTIONS_ACTIVE;
                    const currentText = this.selector.value.trim();
                    if (currentText == '') {
                        this.options[0].setAttribute('value', '-1');
                        this.optionsContainer.style.display = 'none';
                        return;
                    }
                    this.optionsContainer.style.display = '';
                    let fuzzyMatches = this.getFuzzyMatches(currentText);
                    fuzzyMatches = this.postFilter(fuzzyMatches);
                    for (let i = 0; i < this.options.length; i++) {
                        if (i >= fuzzyMatches.length) {
                            this.options[i].className = ClassNames.SELECTOR_OPTION_INACTIVE;
                            continue;
                        }
                        this.options[i].className = ClassNames.SELECTOR_OPTION_ACTIVE;
                        this.options[i].innerText = `${this.getName(Number(fuzzyMatches[i]))}`;
                        this.options[i].setAttribute('value', String(fuzzyMatches[i]));
                    }
                    this.activeOptions = Math.min(fuzzyMatches.length, this.options.length);
                };
            }
            optionOnClick(option) {
                return () => {
                    const id = Number(option.getAttribute('value'));
                    this.updateCb(id);
                    this.selector.value = this.getName(id);
                    this.optionsContainer.className = ClassNames.SELECTOR_OPTIONS_INACTIVE;
                };
            }
            getName(value) {
                for (const entry of this.searchArray) {
                    if (Number(entry.value) == value) {
                        return entry.s;
                    }
                }
                return 'None';
            }
            getElement() {
                return this.el;
            }
        }
        GenericSelector.MAX_OPTIONS = 15;
        class MonsterSelector extends GenericSelector {
            constructor(cards, updateCb, isInherit = false) {
                super([], (id) => {
                    if (isInherit) {
                        updateCb({ inheritId: id });
                    }
                    else {
                        updateCb({ id: id });
                    }
                });
                this.isInherit = false;
                this.cardArray = cards;
                this.selector.placeholder = 'Monster Search';
            }
            getName(id) {
                if (id == -1) {
                    return 'None';
                }
                else {
                    return `${id}: ${ilmina_stripped_2.floof.getCard(id).name}`;
                }
            }
            getFuzzyMatches(text) {
                const splits = text.split(':');
                return fuzzy_search_1.fuzzyMonsterSearch(splits[splits.length - 1].trim(), GenericSelector.MAX_OPTIONS * 3, this.cardArray);
            }
            postFilter(matches) {
                if (this.isInherit) {
                    return matches.filter((match) => ilmina_stripped_2.floof.getCard(match).inheritanceType & 1);
                }
                return matches;
            }
            setId(id) {
                this.optionsContainer.style.display = 'none';
                this.selector.value = this.getName(id);
                if (this.selector == document.activeElement) {
                    this.selector.select();
                    this.options[0].setAttribute('value', String(id));
                }
            }
        }
        class LevelEditor {
            constructor(onUpdate) {
                this.el = create('div', ClassNames.LEVEL_EDITOR);
                this.inheritRow = create('tr');
                this.levelInput = create('input', ClassNames.LEVEL_INPUT);
                this.inheritInput = create('input', ClassNames.LEVEL_INPUT);
                this.maxLevel = 1;
                this.inheritMaxLevel = 1;
                this.maxLevelEl = document.createTextNode('/ 1');
                this.inheritMaxLevelEl = document.createTextNode('/ 1');
                this.onUpdate = onUpdate;
                const table = create('table');
                table.style.fontSize = 'small';
                const monsterLevelRow = create('tr');
                const levelLabel = create('td');
                levelLabel.innerText = 'Monster';
                monsterLevelRow.appendChild(levelLabel);
                const inheritLabel = create('td');
                inheritLabel.innerText = 'Inherit';
                this.inheritRow.appendChild(inheritLabel);
                const levelCell = create('td');
                levelCell.appendChild(document.createTextNode('Lv'));
                this.levelInput.type = 'number';
                this.levelInput.value = '0';
                this.levelInput.onchange = () => {
                    let lv = Number(this.levelInput.value);
                    lv = LevelEditor.levelLimit(lv);
                    if (lv > this.maxLevel) {
                        lv = this.maxLevel;
                    }
                    this.onUpdate({ level: lv });
                };
                levelCell.appendChild(this.levelInput);
                levelCell.appendChild(this.maxLevelEl);
                monsterLevelRow.appendChild(levelCell);
                const monsterLevel1Cell = create('td');
                const monsterLevel1Button = create('button');
                monsterLevel1Button.innerText = 'Lv1';
                monsterLevel1Button.onclick = () => {
                    this.onUpdate({ level: 1 });
                };
                monsterLevel1Cell.appendChild(monsterLevel1Button);
                monsterLevelRow.appendChild(monsterLevel1Cell);
                const monsterLevelMaxCell = create('td');
                const monsterLevelMaxButton = create('button');
                monsterLevelMaxButton.innerText = 'Lv MAX';
                monsterLevelMaxButton.onclick = () => {
                    this.onUpdate({ level: this.maxLevel });
                };
                monsterLevelMaxCell.appendChild(monsterLevelMaxButton);
                monsterLevelRow.appendChild(monsterLevelMaxCell);
                const inheritCell = create('td');
                inheritCell.appendChild(document.createTextNode('Lv'));
                this.inheritInput.type = 'number';
                this.inheritInput.value = '1';
                this.inheritInput.onchange = () => {
                    let lv = Number(this.inheritInput.value);
                    lv = LevelEditor.levelLimit(lv);
                    if (lv > this.inheritMaxLevel) {
                        lv = this.inheritMaxLevel;
                    }
                    this.onUpdate({ inheritLevel: lv });
                };
                inheritCell.appendChild(this.inheritInput);
                inheritCell.appendChild(this.inheritMaxLevelEl);
                this.inheritRow.appendChild(inheritCell);
                const inheritLevel1Cell = create('td');
                const inheritLevel1Button = create('button');
                inheritLevel1Button.innerText = 'Lv1';
                inheritLevel1Button.onclick = () => {
                    this.onUpdate({ inheritLevel: 1 });
                };
                inheritLevel1Cell.appendChild(inheritLevel1Button);
                this.inheritRow.appendChild(inheritLevel1Cell);
                const inheritLevelMaxCell = create('td');
                const inheritLevelMaxButton = create('button');
                inheritLevelMaxButton.innerText = 'Lv MAX';
                inheritLevelMaxButton.onclick = () => {
                    this.onUpdate({ inheritLevel: this.inheritMaxLevel });
                };
                inheritLevelMaxCell.appendChild(inheritLevelMaxButton);
                this.inheritRow.appendChild(inheritLevelMaxCell);
                table.appendChild(monsterLevelRow);
                table.appendChild(this.inheritRow);
                this.inheritRow.style.display = 'none';
                this.el.appendChild(table);
            }
            static levelLimit(lv) {
                if (lv < 1) {
                    return 1;
                }
                if (lv > 110) {
                    return 110;
                }
                return lv;
            }
            getElement() {
                return this.el;
            }
            update({ level, inheritLevel, maxLevel, inheritMaxLevel }) {
                this.maxLevel = maxLevel;
                this.maxLevelEl.data = `/ ${maxLevel}`;
                if (inheritMaxLevel) {
                    this.inheritMaxLevel = inheritMaxLevel;
                    this.levelInput.value = String(level);
                    this.inheritInput.value = String(inheritLevel);
                    this.inheritMaxLevelEl.data = `/ ${inheritMaxLevel}`;
                    this.inheritRow.style.display = '';
                }
                else {
                    this.inheritRow.style.display = 'none';
                }
            }
        }
        class PlusEditor {
            constructor(onUpdate) {
                this.el = create('div');
                this.hpEl = create('input', ClassNames.PLUS_EDITOR);
                this.atkEl = create('input', ClassNames.PLUS_EDITOR);
                this.rcvEl = create('input', ClassNames.PLUS_EDITOR);
                this.inheritEl = create('input');
                this.onUpdate = onUpdate;
                const maxPlusButton = create('button');
                // maxPlusButton.id = 'idc-297-plus-monster';
                maxPlusButton.type = 'button';
                maxPlusButton.innerText = '+297';
                maxPlusButton.onclick = () => {
                    this.onUpdate({
                        hpPlus: 99,
                        atkPlus: 99,
                        rcvPlus: 99,
                    });
                    this.hpEl.value = '99';
                    this.atkEl.value = '99';
                    this.rcvEl.value = '99';
                };
                const minPlusButton = create('button');
                // minPlusButton.id = 'idc-0-plus-monster';
                minPlusButton.type = 'button';
                minPlusButton.innerText = '+0';
                minPlusButton.onclick = () => {
                    this.onUpdate({
                        hpPlus: 0,
                        atkPlus: 0,
                        rcvPlus: 0,
                    });
                    this.hpEl.value = '0';
                    this.atkEl.value = '0';
                    this.rcvEl.value = '0';
                };
                this.hpEl.type = 'number';
                this.hpEl.onchange = () => {
                    this.onUpdate({ hpPlus: Number(this.hpEl.value) });
                };
                this.atkEl.type = 'number';
                this.atkEl.onchange = () => {
                    this.onUpdate({ atkPlus: Number(this.atkEl.value) });
                };
                this.rcvEl.type = 'number';
                this.rcvEl.onchange = () => {
                    this.onUpdate({ rcvPlus: Number(this.rcvEl.value) });
                };
                this.inheritEl.type = 'checkbox';
                this.inheritEl.onclick = () => {
                    this.onUpdate({ inheritPlussed: this.inheritEl.checked });
                };
                const inheritLabel = create('span');
                inheritLabel.innerText = 'Inherit Plussed';
                inheritLabel.onclick = () => this.inheritEl.click();
                this.el.appendChild(document.createTextNode('HP+ '));
                this.el.appendChild(this.hpEl);
                this.el.appendChild(document.createTextNode('ATK+ '));
                this.el.appendChild(this.atkEl);
                this.el.appendChild(document.createTextNode('RCV+ '));
                this.el.appendChild(this.rcvEl);
                this.el.appendChild(this.inheritEl);
                this.el.appendChild(inheritLabel);
                this.el.appendChild(create('br'));
                this.el.appendChild(document.createTextNode('Quick Plus: '));
                this.el.appendChild(maxPlusButton);
                this.el.appendChild(minPlusButton);
            }
            update(hpPlus, atkPlus, rcvPlus, inheritPlussed) {
                this.hpEl.value = String(hpPlus);
                this.atkEl.value = String(atkPlus);
                this.rcvEl.value = String(rcvPlus);
                this.inheritEl.checked = inheritPlussed;
            }
            getElement() {
                return this.el;
            }
        }
        class AwakeningEditor {
            constructor(onUpdate) {
                this.el = create('div');
                this.awakeningArea = create('div');
                this.inheritAwakeningArea = create('div');
                this.superAwakeningArea = create('div');
                this.awakeningSelectors = [];
                this.superAwakeningSelectors = [];
                this.inheritDisplays = [];
                this.el.style.fontSize = 'small';
                this.onUpdate = onUpdate;
                this.awakeningArea.appendChild(document.createTextNode('Awakenings'));
                this.awakeningArea.appendChild(create('br'));
                for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
                    const el = create('a', ClassNames.AWAKENING);
                    el.onclick = () => {
                        this.onUpdate({ awakeningLevel: i });
                    };
                    if (i > 0) {
                        hide(el);
                    }
                    this.awakeningSelectors.push(el);
                    this.awakeningArea.appendChild(el);
                }
                this.el.appendChild(this.awakeningArea);
                for (let i = 0; i < 10; i++) {
                    const el = create('a', ClassNames.AWAKENING);
                    el.style.cursor = 'default';
                    this.inheritDisplays.push(el);
                    if (i > 0) {
                        hide(el);
                    }
                    this.inheritAwakeningArea.appendChild(el);
                }
                this.el.appendChild(this.inheritAwakeningArea);
                this.superAwakeningArea.appendChild(document.createTextNode('Super Awakening'));
                this.superAwakeningArea.appendChild(create('br'));
                for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
                    const el = create('a', ClassNames.AWAKENING);
                    el.onclick = () => {
                        this.onUpdate({ superAwakeningIdx: i - 1 });
                    };
                    if (i > 0) {
                        hide(el);
                    }
                    this.superAwakeningSelectors.push(el);
                    this.superAwakeningArea.appendChild(el);
                }
                this.el.appendChild(this.superAwakeningArea);
            }
            getElement() {
                return this.el;
            }
            // TODO
            update(awakenings, // All awakenings of the current monster.
            superAwakenings, // All super awakenings of the current monster.
            inheritAwakenings, // All awakenings of the inherit monster.
            awakeningLevel, // Current awakening level [0, awakenings.length]
            superAwakeningIdx, // Current Super Awakening selected
            inheritAwakeningLevel = -1) {
                if (awakeningLevel > awakenings.length) {
                    awakeningLevel = awakenings.length;
                }
                if (!awakenings.length) {
                    this.awakeningArea.style.display = 'none';
                }
                else {
                    this.awakeningArea.style.display = '';
                    for (let i = 1; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
                        const el = this.awakeningSelectors[i];
                        if (i > awakenings.length) {
                            hide(el);
                        }
                        else {
                            show(el);
                            el.style.opacity = i > awakeningLevel ? '0.5' : '1';
                            const [x, y] = getAwakeningOffsets(awakenings[i - 1]);
                            el.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;
                        }
                    }
                }
                if (!inheritAwakenings.length || inheritAwakenings[0] != common_3.Awakening.AWOKEN_ASSIST) {
                    this.inheritAwakeningArea.style.display = 'none';
                }
                else {
                    this.inheritAwakeningArea.style.display = '';
                    for (let i = 1; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
                        const el = this.inheritDisplays[i];
                        if (i > inheritAwakenings.length) {
                            hide(el);
                        }
                        else {
                            show(el);
                            el.style.opacity = i <= inheritAwakeningLevel || inheritAwakeningLevel == -1 ? '1' : '0.5';
                            const [x, y] = getAwakeningOffsets(inheritAwakenings[i - 1]);
                            el.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;
                        }
                    }
                }
                if (superAwakeningIdx >= superAwakenings.length) {
                    superAwakeningIdx = -1;
                }
                if (!awakenings.length) {
                    this.superAwakeningArea.style.display = 'none';
                }
                else {
                    this.superAwakeningArea.style.display = '';
                    for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
                        const el = this.superAwakeningSelectors[i];
                        if (i > superAwakenings.length) {
                            hide(el);
                        }
                        else {
                            show(el);
                            el.style.opacity = (i - 1) == superAwakeningIdx ? '1' : '0.5';
                            if (i > 0) {
                                const [x, y] = getAwakeningOffsets(superAwakenings[i - 1]);
                                el.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;
                            }
                        }
                    }
                }
            }
        }
        AwakeningEditor.MAX_AWAKENINGS = 10;
        AwakeningEditor.SCALE = 0.7;
        function getLatentPosition(latent) {
            if (latent < 11) {
                return {
                    x: 36 * latent + 2,
                    y: 38,
                };
            }
            else if (latent < 33) {
                const x = latent % 6;
                const y = Math.floor(latent / 6);
                return {
                    x: (80 * x + 2),
                    y: (36 * y + 2),
                };
            }
            else {
                const x = latent % 2;
                const y = Math.floor(latent / 2) - 11;
                return {
                    x: (238 * x + 2),
                    y: (36 * y + 2),
                };
            }
        }
        exports.getLatentPosition = getLatentPosition;
        class LatentEditor {
            constructor(onUpdate) {
                this.el = create('div');
                this.latentRemovers = [];
                this.latentSelectors = [];
                this.currentLatents = [];
                this.onUpdate = onUpdate;
                this.el.appendChild(document.createTextNode('Latents'));
                this.el.appendChild(create('br'));
                const removerArea = create('div');
                for (let i = 0; i < 8; i++) {
                    const remover = create('a', ClassNames.AWAKENING);
                    remover.style.backgroundPosition = '0px 0px';
                    remover.onclick = () => {
                        this.onUpdate({ removeLatent: i });
                    };
                    this.latentRemovers.push(remover);
                    removerArea.appendChild(remover);
                }
                this.el.appendChild(removerArea);
                const selectorArea = create('div');
                let currentWidth = 0;
                for (let i = 0; i < 38; i++) {
                    let className, addedWidth;
                    if (i < 11) {
                        addedWidth = 1;
                        className = ClassNames.AWAKENING;
                    }
                    else if (i < 33) {
                        addedWidth = 2;
                        className = ClassNames.AWAKENING_SUPER;
                    }
                    else {
                        addedWidth = 6;
                        className = ClassNames.AWAKENING_HYPER;
                    }
                    currentWidth += addedWidth;
                    if (currentWidth > LatentEditor.PER_ROW) {
                        selectorArea.appendChild(create('br'));
                        currentWidth = addedWidth;
                    }
                    const { x, y } = getLatentPosition(i);
                    const selector = create('a', className);
                    selector.style.backgroundPosition = `-${x * AwakeningEditor.SCALE}px -${y * AwakeningEditor.SCALE}px`;
                    selector.onclick = () => this.onUpdate({ addLatent: i });
                    this.latentSelectors.push(selector);
                    selectorArea.appendChild(selector);
                }
                this.el.appendChild(selectorArea);
            }
            getElement() {
                return this.el;
            }
            update(activeLatents, latentKillers, maxLatents = 6) {
                if (!latentKillers.length) {
                    this.el.style.display = 'none';
                    return;
                }
                this.el.style.display = '';
                let totalLatents = 0;
                for (let i = 0; i < 8; i++) {
                    const remover = this.latentRemovers[i];
                    if (totalLatents >= maxLatents) {
                        remover.style.display = 'none';
                        continue;
                    }
                    else if (i >= activeLatents.length) {
                        remover.style.display = '';
                        remover.style.backgroundPosition = `${-2 * AwakeningEditor.SCALE}px ${-2 * AwakeningEditor.SCALE}px`;
                        remover.className = ClassNames.AWAKENING;
                        totalLatents++;
                        continue;
                    }
                    remover.style.display = '';
                    const latent = activeLatents[i];
                    let className;
                    if (latent < 11) {
                        className = ClassNames.AWAKENING;
                        totalLatents += 1;
                    }
                    else if (latent < 33) {
                        className = ClassNames.AWAKENING_SUPER;
                        totalLatents += 2;
                    }
                    else {
                        className = ClassNames.AWAKENING_HYPER;
                        totalLatents += 6;
                    }
                    // const isSuper = latent >= 11;
                    // let offsetWidth, offsetHeight;
                    // const x = isSuper ? (latent - 11) % 5 : latent;
                    // const y = isSuper ? Math.floor((latent - 11) / 5 + 2) : 1;
                    // if (isSuper) {
                    //   offsetWidth = x * -80 - 2;
                    //   offsetHeight = -36 * y;
                    // } else {
                    //   offsetWidth = x * -36;
                    //   offsetHeight = -36;
                    // }
                    const { x, y } = getLatentPosition(latent);
                    remover.className = className;
                    remover.style.backgroundPosition = `-${x * AwakeningEditor.SCALE}px -${y * AwakeningEditor.SCALE}px`;
                }
                // Enable/Disable Generic Killers. (Evo, Awakening, Enhance, Redeemable.)
                for (let i = 12; i < 16; i++) {
                    this.latentSelectors[i].style.opacity = latentKillers.length > 0 ? '1.0' : '0.5';
                }
                for (let i = 16; i <= 23; i++) {
                    this.latentSelectors[i].style.opacity = latentKillers.some((l) => l == i - 11) ? '1' : '0.5';
                }
            }
        }
        LatentEditor.PER_ROW = 13;
        class MonsterEditor {
            constructor(onUpdate) {
                this.el = create('div', ClassNames.MONSTER_EDITOR);
                this.playerModeSelectors = [];
                this.types = [];
                this.el.appendChild(SETTINGS.openButton);
                const pdchuArea = create('div');
                this.pdchu = {
                    io: create('textarea', ClassNames.PDCHU_IO),
                    importButton: create('button'),
                    exportButton: create('button'),
                    exportUrlButton: create('button'),
                };
                this.pdchu.io.placeholder = 'pdchu Import + Export';
                this.pdchu.exportButton.innerText = 'Export pdchu';
                this.pdchu.importButton.innerText = 'Import pdchu';
                this.pdchu.exportUrlButton.innerText = 'Get Link';
                pdchuArea.appendChild(this.pdchu.io);
                pdchuArea.appendChild(this.pdchu.importButton);
                pdchuArea.appendChild(this.pdchu.exportButton);
                pdchuArea.appendChild(this.pdchu.exportUrlButton);
                this.el.appendChild(pdchuArea);
                const playerModeArea = create('div', ClassNames.PLAYER_MODE_SELECTOR);
                const playerModeName = 'valeria-player-mode';
                for (let mode = 1; mode < 4; mode++) {
                    const modeId = `valeria-player-mode-${mode}`;
                    const playerModeLabel = create('label');
                    playerModeLabel.innerText = `${mode}P`;
                    playerModeLabel.setAttribute('for', modeId);
                    const playerModeSelector = create('input');
                    playerModeSelector.id = modeId;
                    playerModeSelector.type = 'radio';
                    playerModeSelector.value = String(mode);
                    playerModeSelector.name = playerModeName;
                    playerModeSelector.onchange = () => {
                        onUpdate({ playerMode: mode });
                    };
                    if (mode == 1) {
                        playerModeSelector.checked = true;
                    }
                    this.playerModeSelectors.push(playerModeSelector);
                    playerModeArea.appendChild(playerModeSelector);
                    playerModeArea.appendChild(playerModeLabel);
                }
                this.badgeSelector = create('select');
                for (const badge of common_3.TEAM_BADGE_ORDER) {
                    const badgeOption = create('option');
                    badgeOption.value = `${badge}`;
                    badgeOption.innerText = common_3.TeamBadgeToName[badge];
                    this.badgeSelector.appendChild(badgeOption);
                }
                this.badgeSelector.onchange = () => {
                    onUpdate({ badge: Number(this.badgeSelector.value) });
                };
                playerModeArea.appendChild(document.createTextNode('Team Badge: '));
                playerModeArea.appendChild(this.badgeSelector);
                this.el.appendChild(playerModeArea);
                this.monsterSelector = new MonsterSelector(fuzzy_search_1.prioritizedMonsterSearch, onUpdate);
                this.inheritSelector = new MonsterSelector(fuzzy_search_1.prioritizedInheritSearch, onUpdate, true);
                this.inheritSelector.selector.placeholder = 'Inherit Search';
                this.el.appendChild(this.monsterSelector.getElement());
                this.el.appendChild(this.inheritSelector.getElement());
                const monsterTypeDiv = create('div');
                for (let i = 0; i < 3; i++) {
                    const monsterType = new MonsterTypeEl(common_3.MonsterType.NONE, 0.7);
                    superHide(monsterType.getElement());
                    this.types.push(monsterType);
                    monsterTypeDiv.appendChild(monsterType.getElement());
                }
                this.el.appendChild(monsterTypeDiv);
                this.levelEditor = new LevelEditor(onUpdate);
                this.el.appendChild(this.levelEditor.getElement());
                this.plusEditor = new PlusEditor(onUpdate);
                this.el.appendChild(this.plusEditor.getElement());
                this.awakeningEditor = new AwakeningEditor(onUpdate);
                this.el.appendChild(this.awakeningEditor.getElement());
                this.latentEditor = new LatentEditor(onUpdate);
                this.el.appendChild(this.latentEditor.getElement());
            }
            update(ctx) {
                this.playerModeSelectors[ctx.mode - 1].checked = true;
                this.badgeSelector.value = `${ctx.badge}`;
                this.monsterSelector.setId(ctx.id);
                this.inheritSelector.setId(ctx.inheritId);
                const c = ilmina_stripped_2.floof.getCard(ctx.id);
                for (let i = 0; i < 3; i++) {
                    if (!c || i >= c.types.length) {
                        superHide(this.types[i].getElement());
                    }
                    else {
                        const monsterType = c.types[i];
                        superShow(this.types[i].getElement());
                        this.types[i].setType(monsterType);
                    }
                }
                let maxLevel = 1;
                if (c) {
                    maxLevel = c.isLimitBreakable ? 110 : c.maxLevel;
                }
                let inheritMaxLevel = 1;
                if (ilmina_stripped_2.floof.hasCard(ctx.inheritId)) {
                    inheritMaxLevel = ilmina_stripped_2.floof.getCard(ctx.inheritId).isLimitBreakable
                        ? 110
                        : ilmina_stripped_2.floof.getCard(ctx.inheritId).maxLevel;
                }
                this.levelEditor.update({
                    level: ctx.level,
                    inheritLevel: ctx.inheritLevel,
                    maxLevel: maxLevel,
                    inheritMaxLevel: inheritMaxLevel,
                });
                this.plusEditor.update(ctx.hpPlus, ctx.atkPlus, ctx.rcvPlus, ctx.inheritPlussed);
                let awakenings = [];
                let superAwakenings = [];
                let inheritAwakenings = [];
                if (c) {
                    awakenings = c.awakenings;
                    superAwakenings = c.superAwakenings;
                }
                if (ilmina_stripped_2.floof.hasCard(ctx.inheritId)) {
                    inheritAwakenings = ilmina_stripped_2.floof.getCard(ctx.inheritId).awakenings;
                }
                this.awakeningEditor.update(awakenings, superAwakenings, inheritAwakenings, ctx.awakeningLevel, ctx.superAwakeningIdx, -1);
                let latentKillers = [];
                if (ilmina_stripped_2.floof.hasCard(ctx.id)) {
                    latentKillers = c.latentKillers;
                }
                let maxLatents = 6;
                if (!c) {
                    maxLatents = 0;
                }
                else if (c.inheritanceType & 32) {
                    maxLatents = 8;
                }
                this.latentEditor.update(ctx.latents, latentKillers, maxLatents);
            }
            getElement() {
                return this.el;
            }
        }
        exports.MonsterEditor = MonsterEditor;
        class HpBar {
            constructor(onUpdate) {
                this.element = create('div', ClassNames.HP_DIV);
                this.maxHp = 1;
                this.currentHp = 1;
                this.sliderEl = create('input', ClassNames.HP_SLIDER);
                this.hpInput = create('input', ClassNames.HP_INPUT);
                this.hpMaxEl = create('span', ClassNames.HP_MAX);
                this.percentEl = create('span', ClassNames.HP_PERCENT);
                this.onUpdate = onUpdate;
                this.sliderEl.type = 'range';
                this.sliderEl.onchange = () => {
                    this.onUpdate(Number(this.sliderEl.value));
                };
                this.element.appendChild(this.sliderEl);
                this.hpInput.onchange = () => {
                    this.onUpdate(common_3.removeCommas(this.hpInput.value));
                };
                this.element.appendChild(this.hpInput);
                const divisionSpan = create('span');
                divisionSpan.innerText = ' / ';
                this.element.appendChild(divisionSpan);
                this.element.appendChild(this.hpMaxEl);
                this.element.appendChild(this.percentEl);
                this.percentEl.innerText = '100%';
            }
            setHp(currentHp, maxHp = -1) {
                if (maxHp > 0) {
                    this.maxHp = maxHp;
                    this.sliderEl.max = String(maxHp);
                }
                this.hpMaxEl.innerText = common_3.addCommas(this.maxHp);
                if (currentHp <= this.maxHp) {
                    this.currentHp = currentHp;
                }
                else {
                    this.currentHp = this.maxHp;
                }
                this.hpInput.value = common_3.addCommas(this.currentHp);
                this.sliderEl.value = String(this.currentHp);
                this.percentEl.innerText = `${Math.round(100 * this.currentHp / this.maxHp)}%`;
            }
            getElement() {
                return this.element;
            }
        }
        class StoredTeamDisplay {
            constructor(saveFn, loadFn, deleteFn) {
                this.element = create('div', ClassNames.TEAM_STORAGE);
                this.saveTeamEl = create('div', ClassNames.TEAM_STORAGE_SAVE);
                this.loadTable = create('table', ClassNames.TEAM_STORAGE_LOAD_AREA);
                this.teamRows = [];
                this.saveTeamEl.innerText = 'Save Team';
                this.saveTeamEl.onclick = saveFn;
                this.element.appendChild(this.saveTeamEl);
                this.element.appendChild(this.loadTable);
                this.loadFn = loadFn;
                this.deleteFn = deleteFn;
            }
            getElement() {
                return this.element;
            }
            update(names) {
                for (let i = 0; i < Math.max(names.length, this.teamRows.length); i++) {
                    if (i >= names.length) {
                        this.teamRows[i].className = ClassNames.TEAM_STORAGE_LOAD_INACTIVE;
                        continue;
                    }
                    else if (i >= this.teamRows.length) {
                        const newRow = create('tr', ClassNames.TEAM_STORAGE_LOAD_ACTIVE);
                        const newLoad = create('td');
                        newLoad.onclick = () => this.loadFn(newLoad.innerText);
                        newRow.appendChild(newLoad);
                        const newDelete = create('td');
                        newDelete.innerText = 'x';
                        newDelete.onclick = () => this.deleteFn(newLoad.innerText);
                        newRow.appendChild(newDelete);
                        this.loadTable.appendChild(newRow);
                        this.teamRows.push(newRow);
                    }
                    this.teamRows[i].className = ClassNames.TEAM_STORAGE_LOAD_ACTIVE;
                    const loadCell = this.teamRows[i].firstElementChild;
                    loadCell.innerText = names[i];
                }
            }
        }
        exports.StoredTeamDisplay = StoredTeamDisplay;
        var ActionOptions;
        (function (ActionOptions) {
            ActionOptions[ActionOptions["COMBO"] = -1] = "COMBO";
        })(ActionOptions || (ActionOptions = {}));
        class TeamPane {
            constructor(storageDisplay, monsterDivs, onTeamUpdate) {
                this.element_ = create('div');
                this.teamDivs = [];
                this.badges = [];
                this.monsterDivs = [];
                this.titleEl = create('input', ClassNames.TEAM_TITLE);
                this.descriptionEl = create('textarea', ClassNames.TEAM_DESCRIPTION);
                this.statsEl = create('div');
                this.statsByIdxByIdx = [];
                this.totalHpValue = create('span', ClassNames.STAT_TOTAL_VALUE);
                this.totalRcvValue = create('span', ClassNames.STAT_TOTAL_VALUE);
                this.totalTimeValue = create('span', ClassNames.STAT_TOTAL_VALUE);
                this.leaderSkillEl = create('span', ClassNames.STAT_TOTAL_VALUE);
                this.battleEl = create('div');
                this.aggregatedAwakeningCounts = new Map();
                this.testResultDiv = create('div');
                this.testTextarea = create('textarea', ClassNames.TEAM_DESCRIPTION);
                this.metaTabs = new TabbedComponent(['Team', 'Save/Load', 'Photo']);
                this.detailTabs = new TabbedComponent(['Stats', 'Description', 'Battle'], 'Stats');
                this.fixedHpEl = new LayeredAsset([], () => { });
                this.fixedHpInput = create('input');
                this.actionSelect = create('select');
                this.actionOptions = [];
                this.applyActionButton = create('button');
                this.leadSwapInput = create('select');
                // All elements to set regarding monster burst.
                // Note that the UI only supports 2 awakenings, types, and attributes.
                this.burstMultiplierInput = create('input');
                this.burstAwakeningScaleInput = create('input');
                this.burstAwakeningSelect1 = create('select');
                this.burstAwakeningSelect2 = create('select');
                this.burstTypeSelect1 = create('select');
                this.burstTypeSelect2 = create('select');
                this.burstAttrSelect1 = create('select');
                this.burstAttrSelect2 = create('select');
                this.rcvMultInput = create('input');
                this.timeBuffInput = create('input');
                this.timeBuffIsMultCb = create('input');
                this.voidEls = [];
                // All elements to set regarding damage.
                this.pingCells = [];
                this.bonusPing = create('td');
                this.pingTotal = create('td');
                this.rawPingCells = [];
                this.rawBonusPing = create('td');
                this.rawPingTotal = create('td');
                this.actualPingCells = [];
                this.actualBonusPing = create('td');
                this.actualPingTotal = create('td');
                this.actualPingPercent = create('td');
                this.hpDamage = create('span');
                this.baseToSwap = -1;
                this.onMonsterSwap = () => { };
                this.onTeamUpdate = onTeamUpdate;
                const teamTab = this.metaTabs.getTab('Team');
                this.titleEl.placeholder = 'Team Name';
                teamTab.appendChild(this.titleEl);
                this.titleEl.onchange = () => {
                    this.onTeamUpdate({ title: this.titleEl.value });
                };
                const resetClickStatus = () => {
                    this.baseToSwap = -1;
                    for (const d of this.monsterDivs) {
                        d.classList.remove(ClassNames.MONSTER_CLICKED);
                    }
                };
                for (let i = 0; i < 3; i++) {
                    this.teamDivs.push(create('div', ClassNames.TEAM_CONTAINER));
                    const badge = create('img', ClassNames.BADGE);
                    badge.src = 'assets/badge/0.png';
                    this.badges.push(badge);
                    this.teamDivs[i].appendChild(badge);
                    for (let j = 0; j < 6; j++) {
                        const d = create('div', ClassNames.MONSTER_CONTAINER);
                        const idx = i * 6 + j;
                        d.appendChild(monsterDivs[idx]);
                        d.onmousedown = () => {
                            this.baseToSwap = idx;
                            d.classList.add(ClassNames.MONSTER_CLICKED);
                        };
                        d.onmouseover = () => {
                            // Nothing right now;
                        };
                        d.onmouseup = () => {
                            if (this.baseToSwap < 0) {
                                return;
                            }
                            if (this.baseToSwap != idx) {
                                this.onMonsterSwap(this.baseToSwap, idx);
                            }
                            this.onTeamUpdate({
                                teamIdx: i,
                                monsterIdx: idx,
                            });
                            this.selectMonster(idx);
                            resetClickStatus();
                        };
                        this.monsterDivs.push(d);
                        this.teamDivs[i].appendChild(d);
                    }
                    teamTab.appendChild(this.teamDivs[i]);
                    teamTab.onmouseup = resetClickStatus;
                    teamTab.onmouseleave = resetClickStatus;
                }
                const descriptionTab = this.detailTabs.getTab('Description');
                this.descriptionEl.placeholder = 'Team Description (This can displayed in Photo and saved)';
                this.descriptionEl.spellcheck = false;
                this.descriptionEl.onchange = () => {
                    this.onTeamUpdate({
                        description: this.descriptionEl.value,
                    });
                };
                descriptionTab.appendChild(this.descriptionEl);
                const statsTab = this.detailTabs.getTab('Stats');
                this.populateStats();
                statsTab.appendChild(this.statsEl);
                const battleTab = this.detailTabs.getTab('Battle');
                this.hpBar = new HpBar((hp) => {
                    this.onTeamUpdate({
                        currentHp: hp,
                    });
                });
                this.populateBattle();
                battleTab.appendChild(this.battleEl);
                teamTab.appendChild(this.detailTabs.getElement());
                this.metaTabs.getTab('Save/Load').appendChild(storageDisplay);
                this.element_.appendChild(this.metaTabs.getElement());
            }
            selectMonster(position) {
                for (let i = 0; i < this.monsterDivs.length; i++) {
                    // TODO: Enable double highlighting of 2P leads.
                    if (i != position || this.monsterDivs[i].className == ClassNames.MONSTER_CONTAINER_SELECTED) {
                        this.monsterDivs[i].className = ClassNames.MONSTER_CONTAINER;
                    }
                    else {
                        this.monsterDivs[i].className = ClassNames.MONSTER_CONTAINER_SELECTED;
                    }
                }
            }
            goToTab(s) {
                this.metaTabs.setActiveTab(s);
            }
            createStatRow(labelText, statIndex) {
                const row = create('tr');
                for (let i = 0; i < 6; i++) {
                    const cell = create('td');
                    // Label the first column
                    if (i == 0) {
                        const label = create('div', ClassNames.STAT_LABEL);
                        label.innerText = labelText + ':';
                        cell.appendChild(label);
                    }
                    const value = create('div', ClassNames.STAT_VALUE);
                    cell.appendChild(value);
                    row.appendChild(cell);
                    // Save a reference to the value div for easy access
                    if (!this.statsByIdxByIdx[i]) {
                        this.statsByIdxByIdx[i] = [];
                    }
                    this.statsByIdxByIdx[i][statIndex] = value;
                }
                return row;
            }
            populateStats() {
                const statsTable = create('table', ClassNames.STAT_TABLE);
                const hpRow = this.createStatRow('HP', StatIndex.HP);
                const atkRow = this.createStatRow('ATK', StatIndex.ATK);
                const rcvRow = this.createStatRow('RCV', StatIndex.RCV);
                const cdRow = this.createStatRow('CD', StatIndex.CD);
                statsTable.appendChild(hpRow);
                statsTable.appendChild(atkRow);
                statsTable.appendChild(rcvRow);
                statsTable.appendChild(cdRow);
                this.statsEl.appendChild(statsTable);
                const totalBaseStatEl = create('div');
                totalBaseStatEl.appendChild(this.leaderSkillEl);
                totalBaseStatEl.appendChild(create('br'));
                totalBaseStatEl.appendChild(this.totalHpValue);
                totalBaseStatEl.appendChild(this.totalRcvValue);
                totalBaseStatEl.appendChild(this.totalTimeValue);
                this.statsEl.appendChild(totalBaseStatEl);
                const awakeningsToDisplay = [
                    [
                        common_3.Awakening.SKILL_BOOST,
                        common_3.Awakening.TIME,
                        common_3.Awakening.SOLOBOOST,
                        common_3.Awakening.BONUS_ATTACK,
                        common_3.Awakening.BONUS_ATTACK_SUPER,
                        common_3.Awakening.L_GUARD,
                    ],
                    [
                        common_3.Awakening.SBR,
                        common_3.Awakening.RESIST_POISON,
                        common_3.Awakening.RESIST_BLIND,
                        common_3.Awakening.RESIST_JAMMER,
                        common_3.Awakening.RESIST_CLOUD,
                        common_3.Awakening.RESIST_TAPE,
                    ],
                    [
                        common_3.Awakening.OE_FIRE,
                        common_3.Awakening.OE_WATER,
                        common_3.Awakening.OE_WOOD,
                        common_3.Awakening.OE_LIGHT,
                        common_3.Awakening.OE_DARK,
                        common_3.Awakening.OE_HEART,
                    ],
                    [
                        common_3.Awakening.ROW_FIRE,
                        common_3.Awakening.ROW_WATER,
                        common_3.Awakening.ROW_WOOD,
                        common_3.Awakening.ROW_LIGHT,
                        common_3.Awakening.ROW_DARK,
                        common_3.Awakening.RECOVER_BIND,
                    ],
                    [
                        common_3.Awakening.RESIST_FIRE,
                        common_3.Awakening.RESIST_WATER,
                        common_3.Awakening.RESIST_WOOD,
                        common_3.Awakening.RESIST_LIGHT,
                        common_3.Awakening.RESIST_DARK,
                        common_3.Awakening.AUTOHEAL,
                    ],
                ];
                const awakeningTable = create('table', ClassNames.AWAKENING_TABLE);
                for (const awakeningSet of awakeningsToDisplay) {
                    const awakeningRow = create('tr');
                    for (const awakening of awakeningSet) {
                        const container = create('td');
                        const awakeningIcon = create('span', ClassNames.AWAKENING);
                        const [x, y] = getAwakeningOffsets(awakening);
                        awakeningIcon.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;
                        container.appendChild(awakeningIcon);
                        const aggregatedAwakeningCount = create('span');
                        aggregatedAwakeningCount.innerText = 'x0';
                        this.aggregatedAwakeningCounts.set(awakening, aggregatedAwakeningCount);
                        container.appendChild(aggregatedAwakeningCount);
                        awakeningRow.appendChild(container);
                    }
                    awakeningTable.appendChild(awakeningRow);
                }
                this.statsEl.appendChild(awakeningTable);
                const testArea = create('div');
                const docEl = create('a');
                docEl.href = 'https://github.com/mtkwock/Valeria#team-conformance-tests';
                docEl.target = '_blank';
                docEl.innerText = 'Team Testing Guide';
                testArea.appendChild(docEl);
                testArea.appendChild(this.testResultDiv);
                this.testTextarea.onchange = () => {
                    this.onTeamUpdate({
                        tests: this.testTextarea.value,
                    });
                };
                this.testTextarea.placeholder = 'Write tests here such as "{P1.SB} >= 10"';
                this.testTextarea.spellcheck = false;
                testArea.appendChild(this.testTextarea);
                this.statsEl.appendChild(testArea);
            }
            populateBattle() {
                // HP Element
                const hpEl = this.hpBar.getElement();
                hpEl.appendChild(this.hpDamage);
                this.fixedHpEl = new LayeredAsset([AssetEnum.FIXED_HP], () => {
                    this.fixedHpInput.value = '0';
                    this.onTeamUpdate({ fixedHp: 0 });
                }, false, 0.7);
                this.fixedHpInput.onchange = () => {
                    this.onTeamUpdate({ fixedHp: common_3.removeCommas(this.fixedHpInput.value) });
                };
                // Choose combos or active.
                // const actionSelect = create('select') as HTMLSelectElement;
                this.actionSelect.style.fontSize = 'xx-small';
                this.actionSelect.onchange = () => {
                    this.onTeamUpdate({ action: Number(this.actionSelect.value) });
                };
                const comboOption = create('option');
                comboOption.innerText = 'Apply Combos';
                comboOption.value = String(ActionOptions.COMBO);
                this.actionSelect.appendChild(comboOption);
                for (let i = 0; i < 12; i++) {
                    const activeOption = create('option');
                    activeOption.value = String(i);
                    activeOption.innerText = `${Math.floor(i / 2) + 1}:`;
                    this.actionSelect.appendChild(activeOption);
                    this.actionOptions.push(activeOption);
                }
                this.applyActionButton.innerText = 'Use';
                const leadSwapArea = create('div');
                const leadSwapLabel = create('span');
                leadSwapLabel.innerText = 'Lead Swap: ';
                for (let i = 0; i < 5; i++) {
                    const option = create('option');
                    option.value = String(i);
                    option.innerText = `Sub ${i}`;
                    if (i == 0) {
                        option.selected = true;
                        option.innerText = 'Lead';
                    }
                    this.leadSwapInput.appendChild(option);
                }
                this.leadSwapInput.onchange = () => {
                    let pos = Number(this.leadSwapInput.value);
                    if (pos < 0) {
                        pos = 0;
                    }
                    if (pos > 4) {
                        pos = 4;
                    }
                    this.onTeamUpdate({ leadSwap: pos });
                };
                leadSwapArea.appendChild(leadSwapLabel);
                leadSwapArea.appendChild(this.leadSwapInput);
                /**
                Burst [  ]  +[  ]x per    [Awakening1]
                                          [Awakening2]
                Restricted  [Attribute1]  [Type1]
                            [Attribute2]  [Type2]
                 */
                const burstTable = create('table');
                burstTable.style.fontSize = 'small';
                const updateBurst = () => {
                    const awakenings = [this.burstAwakeningSelect1.value, this.burstAwakeningSelect2.value].map(Number).filter(Boolean);
                    const attrRestrictions = [this.burstAttrSelect1.value, this.burstAttrSelect2.value].map(Number).filter(n => n >= 0);
                    const typeRestrictions = [this.burstTypeSelect1.value, this.burstTypeSelect2.value].map(Number).filter(n => n >= 0);
                    this.onTeamUpdate({
                        burst: {
                            multiplier: Number(this.burstMultiplierInput.value) || 1,
                            awakenings,
                            awakeningScale: Number(this.burstAwakeningScaleInput.value) || 0,
                            attrRestrictions,
                            typeRestrictions,
                        },
                    });
                };
                const multiplierRow = create('tr');
                const baseBurstCell = create('td');
                const burstReset = create('span', 'hover-click');
                burstReset.innerText = 'X';
                burstReset.onclick = () => {
                    this.onTeamUpdate({
                        burst: {
                            multiplier: 1,
                            awakenings: [],
                            awakeningScale: 0,
                            attrRestrictions: [],
                            typeRestrictions: [],
                        }
                    });
                };
                const burstMultiplierLabel = create('span');
                burstMultiplierLabel.innerText = 'Burst ';
                this.burstMultiplierInput.value = '1';
                this.burstMultiplierInput.type = 'number';
                this.burstMultiplierInput.onchange = updateBurst;
                this.burstMultiplierInput.style.width = '45px';
                baseBurstCell.appendChild(burstReset);
                baseBurstCell.appendChild(burstMultiplierLabel);
                baseBurstCell.appendChild(this.burstMultiplierInput);
                // const awakeningScaleArea = create('div');
                const burstScaleCell = create('td');
                burstScaleCell.appendChild(document.createTextNode('+ '));
                this.burstAwakeningScaleInput.onchange = updateBurst;
                this.burstAwakeningScaleInput.style.width = '35px';
                burstScaleCell.appendChild(this.burstAwakeningScaleInput);
                burstScaleCell.appendChild(document.createTextNode('x per '));
                const burstAwakeningCell = create('td');
                for (let i = 0; i < common_3.AwakeningToName.length; i++) {
                    const option1 = create('option');
                    const option2 = create('option');
                    option1.innerText = i == 0 ? 'Awakening1' : common_3.AwakeningToName[i];
                    option2.innerText = i == 0 ? 'Awakening2' : common_3.AwakeningToName[i];
                    option1.value = String(i);
                    option2.value = String(i);
                    this.burstAwakeningSelect1.appendChild(option1);
                    this.burstAwakeningSelect2.appendChild(option2);
                }
                this.burstAwakeningSelect1.onchange = updateBurst;
                burstAwakeningCell.appendChild(this.burstAwakeningSelect1);
                this.burstAwakeningSelect2.onchange = updateBurst;
                burstAwakeningCell.appendChild(this.burstAwakeningSelect2);
                multiplierRow.appendChild(baseBurstCell);
                multiplierRow.appendChild(burstScaleCell);
                multiplierRow.appendChild(burstAwakeningCell);
                const restrictionRow = create('tr');
                const restrictionLabelCell = create('td');
                restrictionLabelCell.innerText = 'Restrictions';
                const attrRestrictionCell = create('td');
                for (let i = -1; i < 5; i++) {
                    const option1 = create('option');
                    const option2 = create('option');
                    option1.innerText = i == -1 ? 'Attr' : common_3.AttributeToName.get(i) || '';
                    option2.innerText = i == -1 ? 'Attr' : common_3.AttributeToName.get(i) || '';
                    option1.value = String(i);
                    option2.value = String(i);
                    this.burstAttrSelect1.appendChild(option1);
                    this.burstAttrSelect2.appendChild(option2);
                }
                this.burstAttrSelect1.onchange = updateBurst;
                attrRestrictionCell.appendChild(this.burstAttrSelect1);
                this.burstAttrSelect2.onchange = updateBurst;
                attrRestrictionCell.appendChild(this.burstAttrSelect2);
                const typeRestrictionCell = create('td');
                for (const i of [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 14, 15,]) {
                    const option1 = create('option');
                    const option2 = create('option');
                    option1.innerText = i == -1 ? 'Type' : common_3.TypeToName.get(i) || '';
                    option2.innerText = i == -1 ? 'Type' : common_3.TypeToName.get(i) || '';
                    option1.value = String(i);
                    option2.value = String(i);
                    this.burstTypeSelect1.appendChild(option1);
                    this.burstTypeSelect2.appendChild(option2);
                }
                this.burstTypeSelect1.onchange = updateBurst;
                typeRestrictionCell.appendChild(this.burstTypeSelect1);
                this.burstTypeSelect2.onchange = updateBurst;
                typeRestrictionCell.appendChild(this.burstTypeSelect2);
                restrictionRow.appendChild(restrictionLabelCell);
                restrictionRow.appendChild(attrRestrictionCell);
                restrictionRow.appendChild(typeRestrictionCell);
                burstTable.appendChild(multiplierRow);
                burstTable.appendChild(restrictionRow);
                const rcvTimeArea = create('div');
                const timeBuffLabel = create('span');
                timeBuffLabel.innerText = 'Time Buff: ';
                rcvTimeArea.appendChild(timeBuffLabel);
                this.timeBuffInput.type = 'number';
                this.timeBuffInput.onchange = () => {
                    this.onTeamUpdate({ timeBuff: parseInt(this.timeBuffInput.value) });
                };
                rcvTimeArea.appendChild(this.timeBuffInput);
                this.timeBuffIsMultCb.type = 'checkbox';
                this.timeBuffIsMultCb.onchange = () => this.onTeamUpdate({ timeIsMult: this.timeBuffIsMultCb.checked });
                rcvTimeArea.appendChild(this.timeBuffIsMultCb);
                const timeIsMultLabel = create('span');
                timeIsMultLabel.innerText = 'Multiply';
                rcvTimeArea.appendChild(timeIsMultLabel);
                rcvTimeArea.appendChild(create('br'));
                const rcvMultLabel = create('span');
                rcvMultLabel.innerText = 'RCV Mult: ';
                rcvTimeArea.appendChild(rcvMultLabel);
                this.rcvMultInput.type = 'number';
                this.rcvMultInput.onchange = () => this.onTeamUpdate({ rcvBuff: Number(this.rcvMultInput.value) });
                rcvTimeArea.appendChild(this.rcvMultInput);
                // Player State including
                // * Void Attr, Void
                const voidDamageAbsorb = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.ABSORB_OVERLAY, AssetEnum.VOID], (active) => {
                    console.log(`Setting Void Damage Absorb to ${active}`);
                    this.onTeamUpdate({ voidDamageAbsorb: active });
                }, true, 1);
                const voidAttributeAbsorb = new LayeredAsset([AssetEnum.COLOR_WHEEL, AssetEnum.VOID], (active) => {
                    console.log(`Setting Void Attribute Absorb to ${active}`);
                    this.onTeamUpdate({ voidAttributeAbsorb: active });
                }, true, 1);
                const voidDamageVoid = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.VOID_OVERLAY, AssetEnum.VOID], (active) => {
                    console.log(`Setting Void Damage Void to ${active}`);
                    this.onTeamUpdate({ voidDamageVoid: active });
                }, true, 1);
                const voidAwakenings = new LayeredAsset([AssetEnum.AWOKEN_BIND], (active) => {
                    this.onTeamUpdate({ voidAwakenings: active });
                });
                this.voidEls.push(voidDamageAbsorb);
                this.voidEls.push(voidAttributeAbsorb);
                this.voidEls.push(voidDamageVoid);
                this.voidEls.push(voidAwakenings);
                const elsToManageOpacity = [
                    voidDamageAbsorb.getAssetPart(2),
                    voidAttributeAbsorb.getAssetPart(1),
                    voidDamageVoid.getAssetPart(2),
                ];
                // Make the x blink.
                setInterval(() => {
                    const d = new Date();
                    const time = d.getSeconds() + d.getMilliseconds() / 1000;
                    const opacity = 0.5 * (Math.sin(3.14 * time) + 1);
                    for (const idx in elsToManageOpacity) {
                        elsToManageOpacity[idx].style.opacity = String(this.voidEls[idx].active ? opacity : opacity * 0.5);
                    }
                }, 75);
                const toggleArea = create('div');
                toggleArea.appendChild(voidDamageAbsorb.getElement());
                toggleArea.appendChild(voidAttributeAbsorb.getElement());
                toggleArea.appendChild(voidDamageVoid.getElement());
                toggleArea.appendChild(voidAwakenings.getElement());
                const damageTable = create('table', ClassNames.DAMAGE_TABLE);
                const rawDamageTable = create('table', ClassNames.DAMAGE_TABLE);
                const actualDamageTable = create('table', ClassNames.DAMAGE_TABLE);
                const mainRow = create('tr');
                const subRow = create('tr');
                const rawMainRow = create('tr');
                const rawSubRow = create('tr');
                const actualMainRow = create('tr');
                const actualSubRow = create('tr');
                this.pingCells = Array(12);
                this.rawPingCells = Array(12);
                this.actualPingCells = Array(1);
                for (let i = 0; i < 6; i++) {
                    const mainPingCell = create('td');
                    const subPingCell = create('td');
                    const rawMainPingCell = create('td');
                    const rawSubPingCell = create('td');
                    const actualMainPingCell = create('td');
                    const actualSubPingCell = create('td');
                    mainPingCell.innerText = '0';
                    subPingCell.innerText = '0';
                    rawMainPingCell.innerText = '0';
                    rawSubPingCell.innerText = '0';
                    actualMainPingCell.innerText = '0';
                    actualSubPingCell.innerText = '0';
                    mainRow.appendChild(mainPingCell);
                    subRow.appendChild(subPingCell);
                    rawMainRow.appendChild(rawMainPingCell);
                    rawSubRow.appendChild(rawSubPingCell);
                    actualMainRow.appendChild(actualMainPingCell);
                    actualSubRow.appendChild(actualSubPingCell);
                    this.pingCells[i] = mainPingCell;
                    this.pingCells[i + 6] = subPingCell;
                    this.rawPingCells[i] = rawMainPingCell;
                    this.rawPingCells[i + 6] = rawSubPingCell;
                    this.actualPingCells[i] = actualMainPingCell;
                    this.actualPingCells[i + 6] = actualSubPingCell;
                }
                const bonusRow = create('tr');
                const bonusAttackLabel = create('td');
                bonusAttackLabel.innerText = 'Bonus Attack';
                bonusRow.appendChild(bonusAttackLabel);
                bonusRow.appendChild(this.bonusPing);
                const totalAttackLabel = create('td');
                totalAttackLabel.innerText = 'Total';
                bonusRow.appendChild(totalAttackLabel);
                bonusRow.appendChild(this.pingTotal);
                const rawBonusRow = create('tr');
                const rawBonusAttackLabel = create('td');
                rawBonusAttackLabel.innerText = 'Bonus Attack';
                rawBonusRow.appendChild(rawBonusAttackLabel);
                rawBonusRow.appendChild(this.rawBonusPing);
                const rawTotalAttackLabel = create('td');
                rawTotalAttackLabel.innerText = 'Total';
                rawBonusRow.appendChild(rawTotalAttackLabel);
                rawBonusRow.appendChild(this.rawPingTotal);
                const actualBonusRow = create('tr');
                const actualBonusAttackLabel = create('td');
                actualBonusAttackLabel.innerText = 'Bonus Attack';
                actualBonusRow.appendChild(actualBonusAttackLabel);
                actualBonusRow.appendChild(this.actualBonusPing);
                const actualTotalAttackLabel = create('td');
                actualTotalAttackLabel.innerText = 'Total';
                actualBonusRow.appendChild(actualTotalAttackLabel);
                actualBonusRow.appendChild(this.actualPingTotal);
                const actualPercentLabel = create('td');
                actualPercentLabel.innerText = 'Max Health';
                actualBonusRow.appendChild(actualPercentLabel);
                actualBonusRow.appendChild(this.actualPingPercent);
                damageTable.appendChild(mainRow);
                damageTable.appendChild(subRow);
                damageTable.appendChild(bonusRow);
                rawDamageTable.appendChild(rawMainRow);
                rawDamageTable.appendChild(rawSubRow);
                rawDamageTable.appendChild(rawBonusRow);
                actualDamageTable.appendChild(actualMainRow);
                actualDamageTable.appendChild(actualSubRow);
                actualDamageTable.appendChild(actualBonusRow);
                this.battleEl.appendChild(hpEl);
                this.battleEl.appendChild(this.fixedHpEl.getElement());
                this.battleEl.appendChild(this.fixedHpInput);
                this.battleEl.appendChild(create('br'));
                this.battleEl.appendChild(this.actionSelect);
                this.battleEl.appendChild(this.applyActionButton);
                this.battleEl.appendChild(leadSwapArea);
                this.battleEl.appendChild(burstTable);
                this.battleEl.appendChild(rcvTimeArea);
                this.battleEl.appendChild(toggleArea);
                this.battleEl.appendChild(create('hr'));
                this.battleEl.appendChild(document.createTextNode('Base Damage'));
                this.battleEl.appendChild(damageTable);
                this.battleEl.appendChild(create('hr'));
                this.battleEl.appendChild(document.createTextNode('Damage Dealt'));
                this.battleEl.appendChild(rawDamageTable);
                this.battleEl.appendChild(create('hr'));
                this.battleEl.appendChild(document.createTextNode('Effective Damage Dealt'));
                this.battleEl.appendChild(actualDamageTable);
            }
            // TODO
            update(playerMode, title, description, badges) {
                for (let i = 1; i < this.teamDivs.length; i++) {
                    if (i < playerMode) {
                        this.teamDivs[i].style.display = '';
                    }
                    else {
                        this.teamDivs[i].style.display = 'none';
                    }
                }
                this.titleEl.value = title;
                this.descriptionEl.value = description;
                for (let i = 0; i < 3; i++) {
                    this.badges[i].src = `assets/badge/${badges[i]}.png`;
                    if (playerMode != 2) {
                        superShow(this.badges[i]);
                    }
                    else {
                        superHide(this.badges[i]);
                    }
                }
            }
            getElement() {
                return this.element_;
            }
            updateStats(stats) {
                for (let i = 0; i < 6; i++) {
                    const statsByIdx = this.statsByIdxByIdx[i];
                    statsByIdx[StatIndex.HP].innerText = stats.hps[i] ? String(stats.hps[i]) : '';
                    statsByIdx[StatIndex.ATK].innerText = stats.atks[i] ? String(stats.atks[i]) : '';
                    statsByIdx[StatIndex.RCV].innerText = stats.hps[i] ? String(stats.rcvs[i]) : '';
                    statsByIdx[StatIndex.CD].innerText = stats.cds[i];
                }
                this.totalHpValue.innerText = `Total HP: ${common_3.addCommas(stats.totalHp)}`;
                if (stats.totalHp != stats.effectiveHp) {
                    this.totalHpValue.innerText += ` (${common_3.addCommas(stats.effectiveHp)})`;
                }
                this.totalRcvValue.innerText = `Total RCV: ${common_3.addCommas(stats.totalRcv)}`;
                this.totalTimeValue.innerText = `Time: ${stats.totalTime}s`;
                const lead = stats.lead;
                let leaderSkillString = 'Lead: ';
                if (lead.bigBoard) {
                    leaderSkillString += '[7x6] ';
                }
                leaderSkillString += `${lead.hp}-${lead.atk}-${lead.rcv}`;
                if (lead.damageMult != 1) {
                    leaderSkillString += ` Resist: ${((1 - lead.damageMult) * 100).toPrecision(2)}%`;
                }
                if (lead.plusCombo) {
                    leaderSkillString += ` +${lead.plusCombo}c`;
                }
                if (lead.bonusAttack || lead.trueBonusAttack) {
                    leaderSkillString += ' Autofua: ';
                    if (lead.bonusAttack) {
                        leaderSkillString += `${common_3.addCommas(lead.bonusAttack)}`;
                    }
                    if (lead.bonusAttack && lead.trueBonusAttack) {
                        leaderSkillString += ' + ';
                    }
                    if (lead.trueBonusAttack) {
                        leaderSkillString += `${common_3.addCommas(lead.trueBonusAttack)} true`;
                    }
                }
                this.leaderSkillEl.innerText = leaderSkillString;
                for (const awakening of this.aggregatedAwakeningCounts.keys()) {
                    const val = this.aggregatedAwakeningCounts.get(awakening);
                    if (val) {
                        const count = stats.counts.get(awakening) || 0;
                        val.innerText = `x${count}`;
                        const awakeningCell = val.parentElement || val;
                        if (count == 0) {
                            awakeningCell.classList.add(ClassNames.HALF_OPACITY);
                        }
                        else {
                            awakeningCell.classList.remove(ClassNames.HALF_OPACITY);
                        }
                    }
                }
                this.testTextarea.value = stats.tests;
                if (stats.testResult.length) {
                    this.testResultDiv.innerText = 'Tests Failing:\n' + stats.testResult.join('\n');
                    this.testResultDiv.style.backgroundColor = 'red';
                }
                else {
                    this.testResultDiv.innerText = 'All tests passed.';
                    this.testResultDiv.style.backgroundColor = 'green';
                }
            }
            updateBattle(teamBattle) {
                this.hpBar.setHp(teamBattle.currentHp, teamBattle.maxHp);
                for (let i = 0; i < this.actionOptions.length; i++) {
                    const c = ilmina_stripped_2.floof.getCard(teamBattle.ids[i]);
                    const option = this.actionOptions[i];
                    if (!c) {
                        option.innerText = '';
                        option.disabled = true;
                        superHide(option);
                    }
                    else {
                        let text = `${Math.floor(i / 2) + 1}: ${ilmina_stripped_2.floof.getPlayerSkill(c.activeSkillId).description.replace('\n', ' ')}`;
                        option.innerText = text.length >= 80 ? text.substring(0, 77) + '...' : text;
                        option.disabled = false;
                        superShow(option);
                    }
                }
                this.leadSwapInput.value = `${teamBattle.leadSwap}`;
                this.timeBuffInput.value = String(teamBattle.timeBuff);
                this.timeBuffIsMultCb.checked = teamBattle.timeIsMult;
                this.rcvMultInput.value = String(teamBattle.rcvBuff);
                this.burstMultiplierInput.value = String(teamBattle.burst.multiplier).substring(0, 4);
                this.burstAwakeningScaleInput.value = String(teamBattle.burst.awakeningScale);
                this.burstAwakeningSelect1.value = String(teamBattle.burst.awakenings[0] || 0);
                this.burstAwakeningSelect2.value = String(teamBattle.burst.awakenings[1] || 0);
                this.burstAttrSelect1.value = teamBattle.burst.attrRestrictions.length
                    ? String(teamBattle.burst.attrRestrictions[0])
                    : '-1';
                this.burstAttrSelect2.value = teamBattle.burst.attrRestrictions.length > 1
                    ? String(teamBattle.burst.attrRestrictions[1])
                    : '-1';
                this.burstTypeSelect1.value = teamBattle.burst.typeRestrictions.length
                    ? String(teamBattle.burst.typeRestrictions[0])
                    : '-1';
                this.burstTypeSelect2.value = teamBattle.burst.typeRestrictions.length > 1
                    ? String(teamBattle.burst.typeRestrictions[1])
                    : '-1';
                for (const idx in teamBattle.voids) {
                    this.voidEls[idx].setActive(teamBattle.voids[idx]);
                }
                this.fixedHpEl.setActive(teamBattle.fixedHp > 0);
                this.fixedHpInput.value = common_3.addCommas(teamBattle.fixedHp);
            }
            updateDamage(action, pings, rawPings, actualPings, enemyHp, healing) {
                this.actionSelect.value = String(action);
                while (pings.length < 13) {
                    pings.push({ attribute: common_3.Attribute.NONE, damage: 0 });
                    rawPings.push({ attribute: common_3.Attribute.NONE, damage: 0 });
                    actualPings.push({ attribute: common_3.Attribute.NONE, damage: 0 });
                }
                for (let i = 0; i < 12; i++) {
                    this.pingCells[i].innerText = common_3.addCommas(pings[i].damage);
                    this.pingCells[i].style.color = pings[i].damage ? common_3.AttributeToFontColor[pings[i].attribute] : common_3.FontColor.COLORLESS;
                    this.rawPingCells[i].innerText = common_3.addCommas(rawPings[i].damage);
                    this.rawPingCells[i].style.color = rawPings[i].damage ? common_3.AttributeToFontColor[rawPings[i].attribute] : common_3.FontColor.COLORLESS;
                    this.actualPingCells[i].innerText = common_3.addCommas(actualPings[i].damage);
                    this.actualPingCells[i].style.color = actualPings[i].damage ? common_3.AttributeToFontColor[actualPings[i].attribute] : common_3.FontColor.COLORLESS;
                }
                this.pingTotal.innerText = common_3.addCommas(pings.reduce((t, p) => t + p.damage, 0));
                this.rawPingTotal.innerText = common_3.addCommas(rawPings.reduce((t, p) => t + p.damage, 0));
                const d = actualPings.reduce((t, p) => t + p.damage, 0);
                this.actualPingTotal.innerText = common_3.addCommas(actualPings.reduce((t, p) => t + p.damage, 0));
                this.actualPingPercent.innerText = String(d / enemyHp * 100).substring(0, 5) + '%';
                if (pings.length > 12) {
                    this.bonusPing.innerText = common_3.addCommas(pings[12].damage);
                    this.bonusPing.style.color = pings[12].damage ? common_3.AttributeToFontColor[pings[12].attribute] : common_3.FontColor.COLORLESS;
                    this.rawBonusPing.innerText = common_3.addCommas(rawPings[12].damage);
                    this.rawBonusPing.style.color = rawPings[12].damage ? common_3.AttributeToFontColor[rawPings[12].attribute] : common_3.FontColor.COLORLESS;
                    this.actualBonusPing.innerText = common_3.addCommas(actualPings[12].damage);
                    this.actualBonusPing.style.color = actualPings[12].damage ? common_3.AttributeToFontColor[actualPings[12].attribute] : common_3.FontColor.COLORLESS;
                }
                else {
                    this.bonusPing.innerText = '';
                    this.rawBonusPing.innerText = '';
                    this.actualBonusPing.innerText = '';
                }
                if (healing >= 0) {
                    this.hpDamage.innerText = `+${common_3.addCommas(healing)}`;
                }
                else {
                    this.hpDamage.innerText = `${common_3.addCommas(healing)}`;
                }
            }
        }
        exports.TeamPane = TeamPane;
        class ToggleableImage {
            constructor(el, onToggle, active = true) {
                this.active = true;
                this.element = el;
                this.onToggle = onToggle;
                this.setActive(active);
                const oldOnClick = el.onclick;
                el.onclick = (ev) => {
                    if (oldOnClick) {
                        oldOnClick.apply(el, [ev]);
                    }
                    this.onToggle(!this.active);
                };
            }
            getElement() {
                return this.element;
            }
            getActive() {
                return this.active;
            }
            setActive(active) {
                this.active = active;
                if (this.active) {
                    this.element.classList.remove(ClassNames.HALF_OPACITY);
                }
                else {
                    this.element.classList.add(ClassNames.HALF_OPACITY);
                }
            }
        }
        class MonsterTypeEl {
            constructor(monsterType, scale = 1) {
                this.element = create('a', ClassNames.MONSTER_TYPE);
                this.type = common_3.MonsterType.NONE;
                this.scale = 1;
                this.setType(monsterType);
                this.setScale(scale);
            }
            getTypeOffsets() {
                return {
                    offsetX: this.scale * ((this.type % 13) * 36 + 2),
                    offsetY: this.scale * (36 * Math.floor(this.type / 13) + 288),
                };
            }
            setType(type) {
                this.type = type;
                const { offsetX, offsetY } = this.getTypeOffsets();
                this.element.style.backgroundPosition = `-${offsetX} -${offsetY}`;
            }
            getElement() {
                return this.element;
            }
            setScale(scale) {
                this.scale = scale;
                this.element.style.backgroundSize = `${480 * scale}px ${612 * scale}px`;
                this.element.style.width = `${scale * 36}px`;
                this.element.style.height = `${scale * 36}px`;
                this.setType(this.type);
            }
        }
        class EnemySkillArea {
            constructor(onSkillCb) {
                this.element = create('div');
                this.skillDescriptors = [];
                this.onSkillCb = onSkillCb;
                const skillList = create('ol', ClassNames.ENEMY_SKILL_AREA);
                for (let i = 0; i < EnemySkillArea.MAX_SKILLS; i++) {
                    const descriptor = create('li');
                    descriptor.onclick = () => {
                        if (descriptor.classList.contains(ClassNames.HALF_OPACITY)) {
                            return;
                        }
                        this.onSkillCb(i);
                    };
                    superHide(descriptor);
                    this.skillDescriptors.push(descriptor);
                    skillList.appendChild(descriptor);
                }
                this.element.appendChild(skillList);
            }
            getElement() {
                return this.element;
            }
            update(skills) {
                for (let i = 0; i < EnemySkillArea.MAX_SKILLS; i++) {
                    const descriptor = this.skillDescriptors[i];
                    if (!skills[i]) {
                        superHide(descriptor);
                        continue;
                    }
                    superShow(descriptor);
                    const { description, active } = skills[i];
                    descriptor.innerText = description;
                    if (active) {
                        descriptor.classList.remove(ClassNames.HALF_OPACITY);
                        // descriptor.style.cursor = 'pointer';
                    }
                    else {
                        descriptor.classList.add(ClassNames.HALF_OPACITY);
                        // descriptor.style.cursor = '';
                    }
                }
            }
        }
        exports.EnemySkillArea = EnemySkillArea;
        EnemySkillArea.MAX_SKILLS = 75;
        class DungeonEditor {
            constructor(dungeonNames, onUpdate) {
                this.element = create('div');
                this.dungeonFloorTable = create('table', ClassNames.DUNGEON_EDITOR_FLOORS);
                this.dungeonFloorEls = [];
                this.addEnemyBtns = [];
                this.dungeonEnemies = [];
                this.addFloorBtn = create('button', ClassNames.FLOOR_ADD);
                this.activeFloorIdx = 0;
                this.activeEnemyIdx = 0;
                this.importer = create('textarea');
                this.enemyPicture = new MonsterIcon(true);
                this.enemyTypes = [];
                this.enemyLevelInput = create('input');
                this.dungeonHpInput = create('input');
                this.dungeonAtkInput = create('input');
                this.dungeonDefInput = create('input');
                this.hpInput = create('input');
                this.hpPercentInput = create('input');
                this.maxHp = create('td');
                // ATK = enrage * base atk.
                this.atkFinal = create('td');
                this.rageInput = create('input');
                this.atkBase = create('td');
                // DEF = 100 - Break * Base def
                this.defFinal = create('td');
                this.defBreakInput = create('input');
                this.defBase = create('td');
                // Passive Information.
                this.resolve = create('span');
                this.superResolve = create('span');
                this.resistTypes = new Map();
                this.resistTypePercent = create('span');
                this.resistAttrs = new Map();
                this.resistAttrPercent = create('span');
                // AI Information
                this.counterInput = create('input');
                this.flagsInput = create('input');
                this.chargesInput = create('input');
                this.maxCharges = create('span');
                this.damageAbsorbInput = create('input');
                this.comboAbsorbInput = create('input');
                this.damageVoidInput = create('input');
                this.damageShieldInput = create('input');
                this.attributeAbsorbs = [];
                this.currentAttributeSelect = create('select');
                this.onUpdate = onUpdate;
                this.dungeonSelector = new GenericSelector(dungeonNames, (id) => {
                    this.onUpdate({ loadDungeon: id });
                }, fuzzy_search_aliases_2.DUNGEON_ALIASES);
                const selectorEl = this.dungeonSelector.getElement();
                this.dungeonSelector.selector.placeholder = 'Dungeon Search';
                selectorEl.style.padding = '6px';
                this.element.appendChild(selectorEl);
                const dungeonFloorContainer = create('div', ClassNames.FLOOR_CONTAINER);
                dungeonFloorContainer.appendChild(this.dungeonFloorTable);
                this.element.appendChild(dungeonFloorContainer);
                // this.element.appendChild(create('br'));
                // TODO: Remove line when dungeon customization is necessary.
                superHide(this.addFloorBtn);
                this.addFloorBtn.innerText = 'Add Floor';
                this.addFloorBtn.onclick = () => {
                    this.onUpdate({ addFloor: true });
                };
                this.element.appendChild(this.addFloorBtn);
                this.addFloor();
                // this.setupDungeonMultiplierTable();
                this.element.appendChild(create('hr'));
                this.monsterSelector = new MonsterSelector(fuzzy_search_1.prioritizedEnemySearch, ({ id }) => {
                    if (!id) {
                        return;
                    }
                    this.onUpdate({ activeEnemyId: id });
                });
                this.element.appendChild(this.enemyPicture.getElement());
                for (let i = 0; i < 3; i++) {
                    const typeEl = new MonsterTypeEl(common_3.MonsterType.UNKNOWN_1, 0.7);
                    this.enemyTypes.push(typeEl);
                    hide(typeEl.getElement());
                    this.element.appendChild(typeEl.getElement());
                }
                this.element.appendChild(this.createPassivesArea());
                this.element.appendChild(this.monsterSelector.getElement());
                this.statusShield = new LayeredAsset([AssetEnum.STATUS_SHIELD], (statusShield) => this.onUpdate({ statusShield }), false, 0.7);
                this.invincible = new LayeredAsset([AssetEnum.INVINCIBLE], (invincible) => this.onUpdate({ invincible }), false, 0.7);
                this.setupEnemyStatTable();
                this.setupStatusArea();
                this.setupAiArea();
            }
            /**
            private setupDungeonMultiplierTable(): void {
              const multiplierTable = create('table', ClassNames.ENEMY_STAT_TABLE) as HTMLTableElement;
              const row = create('tr') as HTMLTableRowElement;
              // const atkRow = create('tr') as HTMLTableRowElement;
              // const defRow = create('tr') as HTMLTableRowElement;
          
              const hpLabel = create('td') as HTMLTableCellElement;
              const atkLabel = create('td') as HTMLTableCellElement;
              const defLabel = create('td') as HTMLTableCellElement;
          
              hpLabel.innerText = 'HP';
              atkLabel.innerText = 'Attack';
              defLabel.innerText = 'Defense';
          
              row.appendChild(hpLabel);
              row.appendChild(this.dungeonHpInput);
              row.appendChild(atkLabel);
              row.appendChild(this.dungeonAtkInput);
              row.appendChild(defLabel);
              row.appendChild(this.dungeonDefInput);
          
              this.dungeonHpInput.style.width = `40px`;
              this.dungeonAtkInput.style.width = `40px`;
              this.dungeonDefInput.style.width = `40px`;
          
              this.dungeonHpInput.onchange = (): void => {
                this.onUpdate({ dungeonHpMultiplier: this.dungeonHpInput.value });
              };
              this.dungeonAtkInput.onchange = (): void => {
                this.onUpdate({ dungeonAtkMultiplier: this.dungeonAtkInput.value });
              };
              this.dungeonDefInput.onchange = (): void => {
                this.onUpdate({ dungeonDefMultiplier: this.dungeonDefInput.value });
              };
          
              multiplierTable.appendChild(row);
          
              this.element.appendChild(multiplierTable);
            }
            */
            setDungeonMultipliers(hpMultText, atkMultText, defMultText) {
                this.dungeonHpInput.value = hpMultText;
                this.dungeonAtkInput.value = atkMultText;
                this.dungeonDefInput.value = defMultText;
            }
            createPassivesArea() {
                const passivesEl = create('span');
                const resolveAsset = new LayeredAsset([AssetEnum.RESOLVE], () => { }, true, 0.7);
                const resolveSpan = create('span');
                resolveSpan.appendChild(resolveAsset.getElement());
                resolveSpan.appendChild(this.resolve);
                const superResolveSpan = create('span');
                const superResolveLabel = document.createTextNode('Super Resolve:');
                superResolveSpan.appendChild(superResolveLabel);
                superResolveSpan.appendChild(this.superResolve);
                const resistTypeSpan = create('span');
                for (let i = 0; i < 16; i++) {
                    if (i == 9 || i == 10 || i == 11 || i == 13) {
                        continue;
                    }
                    const t = i;
                    const typeImage = new MonsterTypeEl(t, 0.7);
                    const typeToggle = new ToggleableImage(typeImage.getElement(), () => { }, false);
                    this.resistTypes.set(t, typeToggle);
                    resistTypeSpan.appendChild(typeImage.getElement());
                }
                resistTypeSpan.appendChild(this.resistTypePercent);
                const resistAttrSpan = create('span');
                for (let i = 0; i < 5; i++) {
                    const asset = AssetEnum.FIRE_TRANSPARENT + i;
                    const resistAttr = new LayeredAsset([AssetEnum.SHIELD_BASE, asset], () => { }, true, 0.7);
                    resistAttrSpan.appendChild(resistAttr.getElement());
                    this.resistAttrs.set(i, resistAttr);
                }
                resistAttrSpan.appendChild(this.resistAttrPercent);
                passivesEl.appendChild(document.createTextNode('Passives:'));
                passivesEl.appendChild(resolveSpan);
                passivesEl.appendChild(superResolveSpan);
                passivesEl.appendChild(resistTypeSpan);
                passivesEl.appendChild(resistAttrSpan);
                return passivesEl;
            }
            setupEnemyStatTable() {
                const statTable = create('table', ClassNames.ENEMY_STAT_TABLE);
                const lvRow = create('tr');
                const hpRow = create('tr');
                const atkRow = create('tr');
                const defRow = create('tr');
                this.enemyLevelInput.type = 'number';
                this.enemyLevelInput.style.width = '50px';
                this.hpInput.style.width = '100px';
                const lvLabel = create('td');
                const hpLabel = create('td');
                const atkLabel = create('td');
                const defLabel = create('td');
                lvLabel.innerText = 'Level';
                hpLabel.innerText = 'HP';
                atkLabel.innerText = 'ATK';
                defLabel.innerText = 'DEF';
                const lvCell = create('td');
                const hpCell = create('td');
                const hpPercentCell = create('td');
                const atkCell = create('td');
                const defCell = create('td');
                this.hpInput.onchange = () => this.onUpdate({ hp: common_3.removeCommas(this.hpInput.value) });
                this.hpPercentInput.onchange = () => this.onUpdate({ hpPercent: common_3.removeCommas(this.hpPercentInput.value) });
                this.rageInput.onchange = () => this.onUpdate({ enrage: common_3.removeCommas(this.rageInput.value) });
                this.defBreakInput.onchange = () => this.onUpdate({ defBreak: common_3.removeCommas(this.defBreakInput.value) });
                hpPercentCell.style.textAlign = 'right';
                const enrageAsset = new LayeredAsset([AssetEnum.ENRAGE], () => { }, true, 0.7);
                atkCell.appendChild(enrageAsset.getElement());
                const defBreakAsset = new LayeredAsset([AssetEnum.GUARD_BREAK], () => { }, true, 0.7);
                defCell.appendChild(defBreakAsset.getElement());
                lvCell.appendChild(this.enemyLevelInput);
                hpCell.appendChild(this.hpInput);
                hpPercentCell.appendChild(this.hpPercentInput);
                atkCell.appendChild(this.rageInput);
                defCell.appendChild(this.defBreakInput);
                hpPercentCell.appendChild(document.createTextNode('%'));
                atkCell.appendChild(document.createTextNode('X'));
                defCell.appendChild(document.createTextNode('%'));
                this.enemyLevelInput.onchange = () => {
                    let v = Number(this.enemyLevelInput.value);
                    if (isNaN(v)) {
                        v = 10;
                    }
                    v = Math.round(v);
                    if (v < 1) {
                        v = 1;
                    }
                    if (v > 100) {
                        v = 100;
                    }
                    this.onUpdate({ enemyLevel: v });
                };
                statTable.appendChild(lvRow);
                statTable.appendChild(hpRow);
                statTable.appendChild(atkRow);
                statTable.appendChild(defRow);
                lvRow.appendChild(lvLabel);
                lvRow.appendChild(lvCell);
                hpRow.appendChild(hpLabel);
                hpRow.appendChild(hpCell);
                const hpEqual = create('td');
                hpEqual.innerText = '=';
                hpRow.appendChild(hpEqual);
                hpRow.appendChild(hpPercentCell);
                hpRow.appendChild(this.maxHp);
                atkRow.appendChild(atkLabel);
                atkRow.appendChild(this.atkFinal);
                const atkEqual = create('td');
                atkEqual.innerText = '=';
                atkRow.appendChild(atkEqual);
                atkRow.appendChild(atkCell); // Enrage
                atkRow.appendChild(this.atkBase);
                defRow.appendChild(defLabel);
                defRow.appendChild(this.defFinal);
                const defEqual = create('td');
                defEqual.innerText = '=';
                defRow.appendChild(defEqual);
                defRow.appendChild(defCell);
                defRow.appendChild(this.defBase);
                this.element.appendChild(statTable);
            }
            setupStatusArea() {
                const statusArea = create('div');
                this.comboAbsorbInput.type = 'number';
                this.comboAbsorbInput.style.width = '35px';
                this.damageShieldInput.type = 'number';
                this.damageShieldInput.style.width = '35px';
                this.damageVoidInput.style.width = '90px';
                this.damageAbsorbInput.style.width = '90px';
                this.comboAbsorbInput.value = '0';
                this.damageVoidInput.value = '0';
                this.damageAbsorbInput.value = '0';
                const attributeArea = create('span');
                const attributeLabel = create('span');
                attributeLabel.innerText = 'Attribute: ';
                for (const i of [-1, -2, 0, 1, 2, 3, 4]) {
                    const option = create('option');
                    option.value = String(i);
                    if (i == -1) {
                        option.innerText = 'Main';
                    }
                    else if (i == -2) {
                        option.innerText = 'Sub';
                    }
                    else {
                        option.innerText = common_3.AttributeToName.get(i);
                    }
                    this.currentAttributeSelect.appendChild(option);
                }
                this.currentAttributeSelect.onchange = () => {
                    const attr = parseInt(this.currentAttributeSelect.value);
                    this.onUpdate({ attribute: attr });
                };
                attributeArea.appendChild(attributeLabel);
                attributeArea.appendChild(this.currentAttributeSelect);
                const comboAbsorbArea = create('span');
                const comboAbsorbLabel = new LayeredAsset([AssetEnum.COMBO_ABSORB, AssetEnum.NUMBER_0], () => this.onUpdate({ comboAbsorb: 0 }), true, 0.7);
                comboAbsorbArea.appendChild(comboAbsorbLabel.getElement());
                this.comboAbsorbInput.onchange = () => this.onUpdate({ comboAbsorb: Number(this.comboAbsorbInput.value) });
                comboAbsorbArea.appendChild(this.comboAbsorbInput);
                const damageShieldArea = create('span');
                const damageShieldLabel = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.NUMBER_0], () => this.onUpdate({ damageShield: 0 }), true, 0.7);
                damageShieldArea.appendChild(damageShieldLabel.getElement());
                this.damageShieldInput.onchange = () => this.onUpdate({ damageShield: Number(this.damageShieldInput.value) });
                damageShieldArea.appendChild(this.damageShieldInput);
                const damageAbsorbArea = create('span');
                const damageAbsorbLabel = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.ABSORB_OVERLAY], () => this.onUpdate({ damageAbsorb: 0 }), true, 0.7);
                damageAbsorbArea.appendChild(damageAbsorbLabel.getElement());
                this.damageAbsorbInput.onchange = () => this.onUpdate({ damageAbsorb: Number(this.damageAbsorbInput.value) });
                damageAbsorbArea.appendChild(this.damageAbsorbInput);
                const damageVoidArea = create('span');
                const damageVoidLabel = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.VOID_OVERLAY], () => this.onUpdate({ damageVoid: 0 }), true, 0.7);
                damageVoidArea.appendChild(damageVoidLabel.getElement());
                this.damageVoidInput.onchange = () => this.onUpdate({ damageVoid: Number(this.damageVoidInput.value) });
                damageVoidArea.appendChild(this.damageVoidInput);
                const attributeAbsorbArea = create('div');
                for (let i = 0; i < 5; i++) {
                    const absorbAsset = new LayeredAsset([AssetEnum.FIRE_TRANSPARENT + i, AssetEnum.TWINKLE], () => {
                        const attributeAbsorbs = [];
                        for (let j = 0; j < 5; j++) {
                            if (this.attributeAbsorbs[j].active !== (i == j)) {
                                attributeAbsorbs.push(j);
                            }
                        }
                        this.onUpdate({ attributeAbsorbs });
                    }, false, 0.7);
                    this.attributeAbsorbs.push(absorbAsset);
                    attributeAbsorbArea.appendChild(absorbAsset.getElement());
                }
                statusArea.appendChild(this.statusShield.getElement());
                statusArea.appendChild(this.invincible.getElement());
                statusArea.appendChild(attributeArea);
                statusArea.appendChild(create('br'));
                statusArea.appendChild(comboAbsorbArea);
                statusArea.appendChild(damageShieldArea);
                statusArea.appendChild(damageAbsorbArea);
                statusArea.appendChild(damageVoidArea);
                statusArea.appendChild(attributeAbsorbArea);
                this.element.appendChild(statusArea);
            }
            setupAiArea() {
                const aiEl = create('div');
                const chargesSpan = create('span');
                const chargesLabel = create('span');
                chargesLabel.innerText = 'Charges: ';
                chargesSpan.appendChild(chargesLabel);
                this.chargesInput.style.width = '40px';
                this.chargesInput.onchange = () => this.onUpdate({ charges: Number(this.chargesInput.value) });
                chargesSpan.appendChild(this.chargesInput);
                chargesSpan.appendChild(this.maxCharges);
                const counterSpan = create('span');
                const counterLabel = create('span');
                counterLabel.innerText = 'Counter: ';
                counterSpan.appendChild(counterLabel);
                this.counterInput.style.width = '40px';
                this.counterInput.onchange = () => this.onUpdate({ counter: Number(this.counterInput.value) });
                counterSpan.appendChild(this.counterInput);
                const flagsSpan = create('span');
                const flagsLabel = create('span');
                flagsLabel.innerText = 'Flags: ';
                flagsSpan.appendChild(flagsLabel);
                this.flagsInput.style.width = '80px';
                this.flagsInput.onchange = () => this.onUpdate({ flags: parseInt(this.flagsInput.value, 2) });
                flagsSpan.appendChild(this.flagsInput);
                aiEl.appendChild(chargesSpan);
                aiEl.appendChild(counterSpan);
                aiEl.appendChild(flagsSpan);
                this.element.appendChild(aiEl);
            }
            addFloor() {
                const floorIdx = this.dungeonFloorEls.length;
                const floor = create('tr');
                const label = create('td');
                const floorMonsters = create('td');
                const floorName = create('div');
                floorName.innerText = `F${this.dungeonFloorEls.length + 1}`;
                label.appendChild(floorName);
                const deleteFloorBtn = create('button', ClassNames.FLOOR_DELETE);
                // TODO: Remove line when dungeon customization is necessary.
                superHide(deleteFloorBtn);
                deleteFloorBtn.innerText = '[-]';
                deleteFloorBtn.onclick = () => {
                    this.onUpdate({ removeFloor: floorIdx });
                };
                floor.appendChild(label);
                label.appendChild(deleteFloorBtn);
                const addEnemyBtn = create('button', ClassNames.FLOOR_ENEMY_ADD);
                // TODO: Remove line when dungeon customization is necessary.
                superHide(addEnemyBtn);
                addEnemyBtn.innerText = '+';
                addEnemyBtn.onclick = () => {
                    this.onUpdate({ activeFloor: floorIdx, addEnemy: true });
                };
                this.addEnemyBtns.push(addEnemyBtn);
                floorMonsters.appendChild(addEnemyBtn);
                this.addEnemy(this.dungeonFloorEls.length);
                floor.appendChild(floorMonsters);
                this.dungeonFloorTable.appendChild(floor);
                this.dungeonFloorEls.push(floor);
            }
            addEnemy(floorIdx) {
                const enemy = new MonsterIcon(true);
                enemy.updateId(4014);
                if (floorIdx >= this.dungeonEnemies.length) {
                    this.dungeonEnemies.push([]);
                }
                this.dungeonEnemies[floorIdx].push(enemy);
                const enemyIdx = this.dungeonEnemies[floorIdx].length - 1;
                enemy.getElement().onclick = () => {
                    this.onUpdate({ activeFloor: floorIdx, activeEnemy: enemyIdx });
                };
                const node = this.addEnemyBtns[floorIdx].parentNode;
                if (node) {
                    node.insertBefore(enemy.getElement(), this.addEnemyBtns[floorIdx]);
                }
            }
            setActiveEnemy(floor, monster) {
                for (let i = 0; i < this.dungeonEnemies.length; i++) {
                    for (let j = 0; j < this.dungeonEnemies[i].length; j++) {
                        const el = this.dungeonEnemies[i][j].getElement();
                        if (i == floor && j == monster) {
                            el.className = ClassNames.ICON_SELECTED;
                            // el.scrollIntoView({ block: 'nearest' });
                            const id = this.dungeonEnemies[i][j].id;
                            this.enemyPicture.updateId(id);
                            const card = ilmina_stripped_2.floof.getCard(id);
                            for (let i = 0; i < this.enemyTypes.length; i++) {
                                if (card && card.types && i < card.types.length) {
                                    show(this.enemyTypes[i].getElement());
                                    this.enemyTypes[i].setType(card.types[i]);
                                }
                                else {
                                    hide(this.enemyTypes[i].getElement());
                                }
                            }
                            this.monsterSelector.setId(id);
                        }
                        else {
                            el.className = ClassNames.ICON;
                        }
                    }
                }
            }
            setEnemies(enemyIdsByFloor) {
                while (this.dungeonFloorEls.length < enemyIdsByFloor.length) {
                    this.addFloor();
                }
                for (let i = 0; i < Math.max(enemyIdsByFloor.length, this.dungeonFloorEls.length); i++) {
                    if (i >= enemyIdsByFloor.length) {
                        superHide(this.dungeonFloorEls[i]);
                        continue;
                    }
                    superShow(this.dungeonFloorEls[i]);
                    const enemyIds = enemyIdsByFloor[i];
                    const floorEnemies = this.dungeonEnemies[i];
                    while (floorEnemies.length < enemyIds.length) {
                        this.addEnemy(i);
                    }
                    for (let j = 0; j < Math.max(enemyIds.length, floorEnemies.length); j++) {
                        if (j >= enemyIds.length) {
                            superHide(floorEnemies[j].getElement());
                            continue;
                        }
                        superShow(floorEnemies[j].getElement());
                        floorEnemies[j].updateId(enemyIds[j]);
                    }
                }
            }
            setEnemyStats(s) {
                this.enemyLevelInput.value = String(s.lv);
                this.hpInput.value = common_3.addCommas(s.currentHp);
                this.hpPercentInput.value = String(s.percentHp);
                this.maxHp.innerText = `${common_3.addCommas(s.hp)}`;
                this.atkBase.innerText = `${common_3.addCommas(s.baseAtk)}`;
                this.rageInput.value = common_3.addCommas(s.enrage);
                this.atkFinal.innerText = `${common_3.addCommas(s.atk)}`;
                this.defFinal.innerText = common_3.addCommas(s.def);
                this.defBreakInput.value = common_3.addCommas(s.ignoreDefensePercent);
                this.defBase.innerText = common_3.addCommas(s.baseDef);
                if (s.resolve <= 0) {
                    superHide(this.resolve.parentElement);
                }
                else {
                    superShow(this.resolve.parentElement);
                    this.resolve.innerText = `${s.resolve}%`;
                }
                if (s.superResolve <= 0) {
                    superHide(this.superResolve.parentElement);
                }
                else {
                    superShow(this.superResolve.parentElement);
                    this.superResolve.innerText = `${s.superResolve}%`;
                }
                if (s.typeResists.types.length) {
                    // superShow(grandparentEl((this.resistTypes.get(0) as ToggleableImage).getElement()))
                    superShow(this.resistTypePercent.parentElement);
                    for (const [key, toggle] of [...this.resistTypes.entries()]) {
                        if (s.typeResists.types.includes(key)) {
                            superShow(toggle.getElement());
                        }
                        else {
                            superHide(toggle.getElement());
                        }
                        toggle.setActive(s.typeResists.types.includes(key));
                    }
                    this.resistTypePercent.innerText = `${s.typeResists.percent}%`;
                }
                else {
                    // superHide(grandparentEl((this.resistTypes.get(0) as ToggleableImage).getElement()))
                    superHide(this.resistTypePercent.parentElement);
                }
                if (s.attrResists.attrs.length) {
                    // superShow(grandparentEl((this.resistAttrs.get(0) as LayeredAsset).getElement()));
                    superShow(this.resistAttrPercent.parentElement);
                    for (const [key, asset] of [...this.resistAttrs.entries()]) {
                        if (s.attrResists.attrs.includes(key)) {
                            superShow(asset.getElement());
                        }
                        else {
                            superHide(asset.getElement());
                        }
                        asset.setActive(s.attrResists.attrs.includes(key));
                    }
                    this.resistAttrPercent.innerText = `${s.attrResists.percent}%`;
                }
                else {
                    // superHide(grandparentEl((this.resistAttrs.get(0) as LayeredAsset).getElement()));
                    superHide(this.resistAttrPercent.parentElement);
                }
                this.statusShield.setActive(s.statusShield);
                this.invincible.setActive(s.invincible);
                this.currentAttributeSelect.value = String(s.attribute);
                this.damageVoidInput.value = common_3.addCommas(s.damageVoid);
                this.damageAbsorbInput.value = common_3.addCommas(s.damageAbsorb);
                this.comboAbsorbInput.value = `${s.comboAbsorb}`;
                this.damageShieldInput.value = `${s.damageShield}`;
                for (let i = 0; i < this.attributeAbsorbs.length; i++) {
                    this.attributeAbsorbs[i].setActive(s.attributeAbsorb.includes(i));
                }
                this.maxCharges.innerText = ` / ${s.maxCharges} `;
                this.chargesInput.value = String(s.charges);
                this.counterInput.value = String(s.counter);
                this.flagsInput.value = s.flags.toString(2).padStart(8, '0');
            }
            getElement() {
                return this.element;
            }
        }
        exports.DungeonEditor = DungeonEditor;
        class BattleDisplay {
            constructor(onUpdate) {
                this.enemyPicture = create('img');
                this.enemySelectors = [];
                this.onUpdate = onUpdate;
            }
        }
        class DungeonPane {
            constructor(dungeonNames, onUpdate) {
                this.tabs = new TabbedComponent(['Dungeon']);
                this.onUpdate = onUpdate;
                this.dungeonEditor = new DungeonEditor(dungeonNames, onUpdate);
                this.battleDisplay = new BattleDisplay(onUpdate);
                this.tabs.getTab('Dungeon').appendChild(this.dungeonEditor.getElement());
            }
            getElement() {
                return this.tabs.getElement();
            }
        }
        exports.DungeonPane = DungeonPane;
        class PhotoArea {
            constructor(opts, onUpdate) {
                this.element = create('div');
                this.canvas = create('canvas');
                this.awakeningAnchors = [];
                this.options = opts;
                this.canvas.style.width = '100%';
                this.onUpdate = onUpdate;
                this.createToggle('Display Title', (checked) => this.options.drawTitle = checked, this.options.drawTitle || false);
                this.createToggle('Display Badges (1P and 3P)', (checked) => this.options.drawBadge = checked, this.options.drawBadge || false);
                this.createToggle('Display Cooldowns', (checked) => this.options.showCooldowns = checked, this.options.showCooldowns || false);
                this.createToggle('Display Transformed', (checked) => this.options.useTransform = checked, this.options.useTransform || false);
                this.createToggle('Display Description', (checked) => this.options.showDescription = checked, this.options.showDescription || false);
                this.createToggle('Transparent Background', (checked) => this.options.transparentBackground = checked, this.options.transparentBackground || false);
                this.setupAwakeningToggles();
                this.element.appendChild(this.canvas);
            }
            createToggle(label, onChange, initialCheck) {
                const div = create('div');
                const toggle = create('input');
                toggle.type = 'checkbox';
                toggle.checked = initialCheck;
                toggle.onchange = () => {
                    onChange(toggle.checked);
                    this.onUpdate();
                };
                div.appendChild(toggle);
                div.appendChild(document.createTextNode(label));
                this.element.appendChild(div);
            }
            setupAwakeningToggles() {
                const awakeningDiv = create('div');
                const awakeningRows = [
                    [
                        common_3.Awakening.SKILL_BOOST, common_3.Awakening.SBR, common_3.Awakening.TIME, common_3.Awakening.GUARD_BREAK, common_3.Awakening.SOLOBOOST, common_3.Awakening.OE_HEART,
                        common_3.Awakening.OE_FIRE, common_3.Awakening.OE_WATER, common_3.Awakening.OE_WOOD, common_3.Awakening.OE_LIGHT, common_3.Awakening.OE_DARK,
                    ],
                    [
                        common_3.Awakening.RESIST_BLIND, common_3.Awakening.RESIST_JAMMER, common_3.Awakening.RESIST_POISON, common_3.Awakening.BONUS_ATTACK, common_3.Awakening.BONUS_ATTACK_SUPER, common_3.Awakening.RECOVER_BIND,
                        common_3.Awakening.ROW_FIRE, common_3.Awakening.ROW_WATER, common_3.Awakening.ROW_WOOD, common_3.Awakening.ROW_LIGHT, common_3.Awakening.ROW_DARK,
                    ],
                    [
                        common_3.Awakening.RESIST_CLOUD, common_3.Awakening.RESIST_TAPE, common_3.Awakening.AUTOHEAL, common_3.Awakening.L_UNLOCK, common_3.Awakening.L_GUARD, common_3.Awakening.COMBO_ORB,
                        common_3.Awakening.RESIST_FIRE, common_3.Awakening.RESIST_WATER, common_3.Awakening.RESIST_WOOD, common_3.Awakening.RESIST_LIGHT, common_3.Awakening.RESIST_DARK,
                    ],
                    [
                        common_3.Awakening.DRAGON, common_3.Awakening.GOD, common_3.Awakening.DEVIL, common_3.Awakening.MACHINE, common_3.Awakening.VDP, common_3.Awakening.COMBO_7,
                        common_3.Awakening.COMBO_10, common_3.Awakening.SKILL_CHARGE, common_3.Awakening.MULTIBOOST, common_3.Awakening.HP, common_3.Awakening.HP_MINUS,
                    ],
                    [
                        common_3.Awakening.BALANCED, common_3.Awakening.ATTACKER, common_3.Awakening.PHYSICAL, common_3.Awakening.HEALER, common_3.Awakening.TPA, common_3.Awakening.HP_GREATER,
                        common_3.Awakening.HP_LESSER, common_3.Awakening.RESIST_BIND, common_3.Awakening.TEAM_HP, common_3.Awakening.ATK, common_3.Awakening.ATK_MINUS,
                    ],
                    [
                        common_3.Awakening.EVO, common_3.Awakening.AWOKEN, common_3.Awakening.ENHANCED, common_3.Awakening.REDEEMABLE, common_3.Awakening.JAMMER_BOOST, common_3.Awakening.POISON_BOOST,
                        common_3.Awakening.AWOKEN_ASSIST, common_3.Awakening.VOICE, common_3.Awakening.TEAM_RCV, common_3.Awakening.RCV, common_3.Awakening.RCV_MINUS,
                    ],
                ];
                for (const awakeningRow of awakeningRows) {
                    for (const awakening of awakeningRow) {
                        const awakeningAnchor = create('a', ClassNames.AWAKENING);
                        const [x, y] = getAwakeningOffsets(awakening);
                        awakeningAnchor.style.backgroundPositionX = `${x * AwakeningEditor.SCALE}px`;
                        awakeningAnchor.style.backgroundPositionY = `${y * AwakeningEditor.SCALE}px`;
                        if (!this.options.awakenings || !this.options.awakenings.includes(awakening)) {
                            awakeningAnchor.classList.add(ClassNames.HALF_OPACITY);
                        }
                        awakeningAnchor.onclick = () => {
                            if (awakeningAnchor.classList.contains(ClassNames.HALF_OPACITY)) {
                                this.options.awakenings.push(awakening);
                                awakeningAnchor.classList.remove(ClassNames.HALF_OPACITY);
                            }
                            else {
                                this.options.awakenings.splice(this.options.awakenings.indexOf(awakening), 1);
                                awakeningAnchor.classList.add(ClassNames.HALF_OPACITY);
                            }
                            // this.options.awakenings = this.awakeningAnchors.map((a, idx) => ({ a, idx })).filter(({ a }) => !a.classList.contains(ClassNames.HALF_OPACITY)).map(({ idx }) => idx);
                            this.onUpdate();
                        };
                        this.awakeningAnchors.push(awakeningAnchor);
                        if (awakening > 0) {
                            awakeningDiv.appendChild(awakeningAnchor);
                        }
                    }
                    awakeningDiv.appendChild(create('br'));
                }
                this.element.appendChild(awakeningDiv);
            }
            getElement() {
                return this.element;
            }
            getCanvas() {
                return this.canvas;
            }
            getOptions() {
                return this.options;
            }
        }
        exports.PhotoArea = PhotoArea;
        class ValeriaDisplay {
            constructor() {
                this.element_ = create('div', ClassNames.VALERIA);
                const table = create('table');
                const row = create('tr');
                this.panes = [];
                for (let i = 0; i < 3; i++) {
                    const pane = create('td');
                    this.panes.push(pane);
                    row.appendChild(pane);
                }
                this.leftTabs = new TabbedComponent(['Monster Editor', 'Combo Editor']);
                this.panes[0].appendChild(this.leftTabs.getElement());
                table.appendChild(row);
                this.element_.appendChild(table);
            }
            getElement() {
                return this.element_;
            }
        }
        exports.ValeriaDisplay = ValeriaDisplay;
    });
    define("debugger", ["require", "exports", "templates"], function (require, exports, templates_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class DebuggerEl {
            constructor() {
                this.el = templates_1.create('div');
                this.inputEl = templates_1.create('input');
                this.buttons = [];
                this.textarea = templates_1.create('textarea');
                this.text = '';
                this.el.appendChild(this.inputEl);
                this.el.appendChild(this.textarea);
                this.addButton('Clear', () => {
                    this.text = '';
                    this.textarea.value = '';
                });
                this.textarea.style.width = `100%`;
                this.textarea.style.fontSize = 'small';
                this.textarea.style.height = '250px';
                this.textarea.style.fontFamily = 'monospace';
            }
            addButton(text, onclick) {
                const button = templates_1.create('button');
                button.innerText = text;
                button.onclick = onclick;
                this.el.insertBefore(button, this.textarea);
                this.buttons.push(button);
            }
            getElement() {
                return this.el;
            }
            print(text) {
                this.text += `\n${text}`;
                this.textarea.value = this.text;
            }
        }
        const debug = new DebuggerEl();
        exports.debug = debug;
    });
    define("team_conformance", ["require", "exports", "debugger"], function (require, exports, debugger_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function replacify(text, ctx) {
            const replacementFinder = /{[^}]*}/g;
            const matches = text.match(replacementFinder);
            if (matches) {
                for (let match of matches) {
                    const pieces = match.replace(/[\s{}]/g, '').split('.');
                    let currentVal = ctx;
                    for (const piece of pieces) {
                        try {
                            currentVal = currentVal[piece];
                            if (currentVal == undefined) {
                                return { text, error: `Inaccessible value ${piece} in ${match}` };
                            }
                        }
                        catch (e) {
                            return { text, error: `Inaccessible value ${piece} in ${match}` };
                        }
                    }
                    if (currentVal.constructor != Number) {
                        return { text, error: `Final type of ${match} is not a number` };
                    }
                    text = text.replace(match, `${currentVal}`);
                }
            }
            return { text, error: '' };
        }
        var TokenType;
        (function (TokenType) {
            TokenType[TokenType["UNKNOWN"] = 0] = "UNKNOWN";
            TokenType[TokenType["NUMBER"] = 1] = "NUMBER";
            TokenType[TokenType["OPERATOR"] = 2] = "OPERATOR";
            TokenType[TokenType["FUNCTION"] = 3] = "FUNCTION";
            TokenType[TokenType["LEFT_PAREN"] = 4] = "LEFT_PAREN";
            TokenType[TokenType["RIGHT_PAREN"] = 5] = "RIGHT_PAREN";
        })(TokenType || (TokenType = {}));
        var Operator;
        (function (Operator) {
            Operator["POWER"] = "**";
            Operator["MULTIPLY"] = "*";
            Operator["DIVIDE"] = "/";
            Operator["ADD"] = "+";
            Operator["SUBTRACT"] = "-";
            Operator["BIT_AND"] = "&";
            Operator["BIT_OR"] = "|";
            Operator["BIT_XOR"] = "^";
            Operator["CMP_GTE"] = ">=";
            Operator["CMP_EE"] = "==";
            Operator["CMP_LTE"] = "<=";
            Operator["CMP_NE"] = "!=";
            Operator["CMP_GT"] = ">";
            Operator["CMP_E"] = "=";
            Operator["CMP_LT"] = "<";
            Operator["AND"] = "and";
            Operator["OR"] = "or";
        })(Operator || (Operator = {}));
        const operators = [
            // Must be checked first due to having multiple characters.
            Operator.POWER,
            Operator.AND,
            Operator.OR,
            Operator.CMP_GTE,
            Operator.CMP_EE,
            Operator.CMP_LTE,
            Operator.CMP_NE,
            Operator.MULTIPLY,
            Operator.DIVIDE,
            Operator.ADD,
            Operator.SUBTRACT,
            Operator.BIT_AND,
            Operator.BIT_OR,
            Operator.BIT_XOR,
            Operator.CMP_GT,
            Operator.CMP_E,
            Operator.CMP_LT,
        ];
        const tokenFunctions = {
            min: (args) => Math.min(...args),
            max: (args) => Math.max(...args),
        };
        function tokenize(text) {
            const tokens = [];
            text = text.replace(/\s/g, '');
            const numberRe = /^-?\d+(\.\d+)?/;
            while (text) {
                const numberMatch = text.match(numberRe);
                if (numberMatch) {
                    if (tokens.length && tokens[tokens.length - 1].type == TokenType.NUMBER && numberMatch[0][0] == '-') {
                        tokens.push({
                            s: '-',
                            v: 0,
                            type: TokenType.OPERATOR,
                        });
                        tokens.push({
                            s: '',
                            v: Number(numberMatch[0].substring(1)),
                            type: TokenType.NUMBER,
                        });
                    }
                    else {
                        tokens.push({
                            s: '',
                            v: Number(numberMatch[0]),
                            type: TokenType.NUMBER,
                        });
                    }
                    text = text.replace(numberRe, '');
                    continue;
                }
                let isOperator = false;
                for (const operator of operators) {
                    if (text.startsWith(operator)) {
                        tokens.push({
                            s: operator,
                            v: 0,
                            type: TokenType.OPERATOR,
                        });
                        text = text.replace(operator, '');
                        isOperator = true;
                        break;
                    }
                }
                if (isOperator) {
                    continue;
                }
                if (text.startsWith('(')) {
                    tokens.push({
                        s: '(',
                        v: 0,
                        type: TokenType.LEFT_PAREN,
                    });
                    text = text.substring(1);
                    continue;
                }
                if (text.startsWith(')')) {
                    tokens.push({
                        s: ')',
                        v: 0,
                        type: TokenType.RIGHT_PAREN,
                    });
                    text = text.substring(1);
                    continue;
                }
                // Ignore commas.
                if (text.startsWith(',')) {
                    text = text.substring(1);
                    continue;
                }
                for (const fnName in tokenFunctions) {
                    if (text.startsWith(fnName)) {
                        tokens.push({
                            s: 'fnName',
                            v: 0,
                            type: TokenType.FUNCTION,
                        });
                        text.replace(fnName, '');
                        continue;
                    }
                }
                // UNHANLDED ERROR
                tokens.push({
                    s: text,
                    v: 0,
                    type: TokenType.UNKNOWN,
                });
                text = '';
                debugger_1.debug.print(`Unhandled Token processing: ${text}`);
            }
            return tokens;
        }
        const OperatorPrecendence = {
            '**': 5,
            '*': 4,
            '/': 4,
            '+': 3,
            '-': 3,
            '&': 2,
            '|': 2,
            '^': 2,
            '>=': 1,
            '==': 1,
            '<=': 1,
            '!=': 1,
            '>': 1,
            '=': 1,
            '<': 1,
            'and': 0,
            'or': 0,
        };
        var CompareBoolean;
        (function (CompareBoolean) {
            CompareBoolean[CompareBoolean["TRUE"] = 696969] = "TRUE";
            CompareBoolean[CompareBoolean["FALSE"] = 420420] = "FALSE";
        })(CompareBoolean || (CompareBoolean = {}));
        exports.CompareBoolean = CompareBoolean;
        const Operate = {
            '**': (left, right) => left ** right,
            '*': (left, right) => left * right,
            '/': (left, right) => left / right,
            '+': (left, right) => left + right,
            '-': (left, right) => left - right,
            '&': (left, right) => left & right,
            '|': (left, right) => left | right,
            '^': (left, right) => left ^ right,
            '>=': (left, right) => left >= right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
            '==': (left, right) => left == right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
            '<=': (left, right) => left <= right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
            '!=': (left, right) => left != right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
            '>': (left, right) => left > right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
            '=': (left, right) => left == right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
            '<': (left, right) => left < right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
            'and': (left, right) => (left == CompareBoolean.TRUE) && (right == CompareBoolean.TRUE) ? CompareBoolean.TRUE : CompareBoolean.FALSE,
            'or': (left, right) => (left == CompareBoolean.TRUE) || (right == CompareBoolean.TRUE) ? CompareBoolean.TRUE : CompareBoolean.FALSE,
        };
        /**
         * Implementation of the Shunting-Yard algorithm for queueing operations.
         * See https://en.wikipedia.org/wiki/Shunting-yard_algorithm
         */
        function shuntingYard(text) {
            const tokens = tokenize(text);
            if (!tokens.length || tokens[tokens.length - 1].type == TokenType.UNKNOWN) {
                return 'Unhandled tokens at the end';
            }
            const outputQueue = [];
            const operatorStack = [];
            const top = () => {
                return operatorStack[operatorStack.length - 1];
            };
            for (const token of tokens) {
                if (token.type == TokenType.NUMBER) {
                    outputQueue.push(token);
                }
                else if (token.type == TokenType.FUNCTION) {
                    operatorStack.push(token);
                }
                else if (token.type == TokenType.OPERATOR) {
                    while (operatorStack.length && top().type == TokenType.OPERATOR
                        // Assume all operators are left-associative.
                        && (OperatorPrecendence[top().s] >= OperatorPrecendence[token.s])
                        && top().type != TokenType.LEFT_PAREN) {
                        outputQueue.push(operatorStack.pop());
                    }
                    operatorStack.push(token);
                }
                else if (token.type == TokenType.LEFT_PAREN) {
                    operatorStack.push(token);
                }
                else if (token.type == TokenType.RIGHT_PAREN) {
                    while (operatorStack.length && top().type != TokenType.LEFT_PAREN) {
                        outputQueue.push(operatorStack.pop());
                    }
                    if (operatorStack.length && top().type == TokenType.LEFT_PAREN) {
                        operatorStack.pop();
                    }
                }
                else {
                    debugger_1.debug.print(`Unhandled token: value: ${token.v} string: ${token.s} type: ${token.type}`);
                }
            }
            while (operatorStack.length) {
                if (top().type == TokenType.LEFT_PAREN) {
                    debugger_1.debug.print('Mismatched Parentheses');
                }
                outputQueue.push(operatorStack.pop());
            }
            let numberStack = [];
            for (const output of outputQueue) {
                if (output.type == TokenType.NUMBER) {
                    numberStack.push(output.v);
                }
                else if (output.type == TokenType.OPERATOR) {
                    const right = numberStack.pop();
                    const left = numberStack.pop();
                    if (right == undefined || left == undefined) {
                        debugger_1.debug.print('Insufficient numbers in to operate on.');
                        continue;
                    }
                    let pushVal = Operate[output.s](left, right);
                    numberStack.push(pushVal);
                }
                else if (output.type == TokenType.FUNCTION) {
                    const right = numberStack.pop();
                    const left = numberStack.pop();
                    if (right == undefined || left == undefined) {
                        debugger_1.debug.print('Insufficient numbers in to function on.');
                        continue;
                    }
                    let pushVal = tokenFunctions[output.s]([left, right]);
                    numberStack.push(pushVal);
                }
            }
            if (numberStack.length == 1) {
                return numberStack[0];
            }
            if (numberStack.length > 1) {
                debugger_1.debug.print('Multiple numbers found, returning first');
                return numberStack[0];
            }
            debugger_1.debug.print('No values found?!');
            return 'No values found at the end.';
        }
        function runTest(statement, ctx) {
            const replaced = replacify(statement, ctx);
            if (replaced.error) {
                return replaced.error;
            }
            const value = shuntingYard(replaced.text);
            if (value == CompareBoolean.TRUE) {
                return '';
            }
            if (value == CompareBoolean.FALSE) {
                return `FAILED: ${statement}`;
            }
            return `FAILED: Test result is neither {TRUE} nor {FALSE}: ${statement} resulted in ${value}`;
        }
        exports.runTest = runTest;
        function runTests(testString, ctx) {
            const lines = testString
                .split('\n') // One test per line.
                .map((l) => l.trim()) // Remove whitespace at ends.
                .filter((l) => !l.startsWith('#')) // Allow commented tests.
                .filter(Boolean); // Remove empty lines.
            const result = [];
            for (const line of lines) {
                const err = runTest(line, ctx);
                if (err) {
                    result.push(err);
                }
            }
            return result;
        }
        exports.runTests = runTests;
    });
    define("monster_instance", ["require", "exports", "common", "ilmina_stripped", "templates", "fuzzy_search"], function (require, exports, common_4, ilmina_stripped_3, templates_2, fuzzy_search_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const AWAKENING_BONUS = new Map([
            [common_4.Awakening.HP, 500],
            [common_4.Awakening.HP_MINUS, -5000],
            [common_4.Awakening.ATK, 100],
            [common_4.Awakening.ATK_MINUS, -1000],
            [common_4.Awakening.RCV, 200],
            [common_4.Awakening.RCV_MINUS, -2000],
        ]);
        const LatentHp = new Map([
            [common_4.Latent.HP, 0.015],
            [common_4.Latent.HP_PLUS, 0.045],
            [common_4.Latent.ALL_STATS, 0.03],
        ]);
        const LatentAtk = new Map([
            [common_4.Latent.ATK, 0.01],
            [common_4.Latent.ATK_PLUS, 0.03],
            [common_4.Latent.ALL_STATS, 0.02],
        ]);
        const LatentRcv = new Map([
            [common_4.Latent.RCV, 0.1],
            [common_4.Latent.RCV_PLUS, 0.3],
            [common_4.Latent.ALL_STATS, 0.2],
        ]);
        const LatentToPdchu = new Map([
            [common_4.Latent.HP, 'hp'],
            [common_4.Latent.ATK, 'atk'],
            [common_4.Latent.RCV, 'rcv'],
            [common_4.Latent.HP_PLUS, 'hp+'],
            [common_4.Latent.ATK_PLUS, 'atk+'],
            [common_4.Latent.RCV_PLUS, 'rcv+'],
            [common_4.Latent.TIME, 'te'],
            [common_4.Latent.TIME_PLUS, 'te+'],
            [common_4.Latent.AUTOHEAL, 'ah'],
            [common_4.Latent.RESIST_FIRE, 'rres'],
            [common_4.Latent.RESIST_WATER, 'bres'],
            [common_4.Latent.RESIST_WOOD, 'gres'],
            [common_4.Latent.RESIST_LIGHT, 'lres'],
            [common_4.Latent.RESIST_DARK, 'dres'],
            [common_4.Latent.RESIST_FIRE_PLUS, 'rres+'],
            [common_4.Latent.RESIST_WATER_PLUS, 'bres+'],
            [common_4.Latent.RESIST_WOOD_PLUS, 'gres+'],
            [common_4.Latent.RESIST_LIGHT_PLUS, 'lres+'],
            [common_4.Latent.RESIST_DARK_PLUS, 'dres+'],
            [common_4.Latent.SDR, 'sdr'],
            [common_4.Latent.ALL_STATS, 'all'],
            [common_4.Latent.EVO, 'evk'],
            [common_4.Latent.AWOKEN, 'awk'],
            [common_4.Latent.ENHANCED, 'enk'],
            [common_4.Latent.REDEEMABLE, 'rek'],
            [common_4.Latent.GOD, 'gok'],
            [common_4.Latent.DEVIL, 'dek'],
            [common_4.Latent.DRAGON, 'drk'],
            [common_4.Latent.MACHINE, 'mak'],
            [common_4.Latent.BALANCED, 'bak'],
            [common_4.Latent.ATTACKER, 'aak'],
            [common_4.Latent.PHYSICAL, 'phk'],
            [common_4.Latent.HEALER, 'hek'],
            [common_4.Latent.RESIST_DAMAGE_VOID, 'rdv'],
            [common_4.Latent.RESIST_ATTRIBUTE_ABSORB, 'raa'],
            [common_4.Latent.RESIST_JAMMER_SKYFALL, 'rjs'],
            [common_4.Latent.RESIST_POISON_SKYFALL, 'rps'],
            [common_4.Latent.RESIST_LEADER_SWAP, 'rls'],
        ]);
        exports.LatentToPdchu = LatentToPdchu;
        const PdchuToLatent = new Map();
        for (const key of LatentToPdchu.keys()) {
            PdchuToLatent.set(LatentToPdchu.get(key) || '', key);
        }
        function validatePlus(value) {
            value = Math.round(value);
            if (value < 0 || value > 99) {
                return 0;
            }
            return value;
        }
        function calcScaleStat(card, max, min, level, growth) {
            // Handle Level Limit Breakthrough.
            if (level >= 100) {
                const multiplier = 1 + card.limitBreakStatGain / 100 * (level - 99) / 11;
                return Math.round(max * multiplier);
            }
            if (level == 1) {
                return min;
            }
            const diff = max - min;
            const frac = (level - 1) / (card.maxLevel - 1);
            const added = Math.round(Math.pow(frac, growth) * diff);
            return min + added;
        }
        function monsterJsonEqual(a, b) {
            if (a.id != b.id) {
                return false;
            }
            if (a.level != b.level) {
                return false;
            }
            if (a.awakenings != b.awakenings) {
                return false;
            }
            if (String(a.latents) != String(b.latents)) {
                return false;
            }
            if (a.superAwakeningIdx != b.superAwakeningIdx) {
                return false;
            }
            if (a.hpPlus != b.hpPlus) {
                return false;
            }
            if (a.atkPlus != b.atkPlus) {
                return false;
            }
            if (a.rcvPlus != b.rcvPlus) {
                return false;
            }
            if (a.inheritId != b.inheritId) {
                return false;
            }
            if (a.inheritLevel != b.inheritLevel) {
                return false;
            }
            if (a.inheritPlussed != b.inheritPlussed) {
                return false;
            }
            return true;
        }
        exports.monsterJsonEqual = monsterJsonEqual;
        class MonsterInstance {
            constructor(id = -1, onUpdate = () => { }) {
                this.level = 1;
                this.awakenings = 0;
                this.latents = [];
                this.superAwakeningIdx = -1;
                this.hpPlus = 0;
                this.atkPlus = 0;
                this.rcvPlus = 0;
                this.inheritId = -1;
                this.inheritLevel = 1;
                this.inheritPlussed = false;
                // Attributes set in dungeon.
                this.bound = false; // Monster being bound and unusable.
                this.attribute = common_4.Attribute.NONE; // Attribute override.
                this.transformedTo = -1; // Monster transformation.
                this.id = id;
                this.el = templates_2.create('div');
                this.inheritIcon = new templates_2.MonsterInherit();
                this.icon = new templates_2.MonsterIcon();
                this.icon.setOnUpdate(onUpdate);
                this.latentIcon = new templates_2.MonsterLatent();
                const inheritIconEl = this.inheritIcon.getElement();
                // inheritIconEl.onclick = () => {
                //   const els = document.getElementsByClassName(ClassNames.MONSTER_SELECTOR);
                //   if (els.length > 1) {
                //     const el = els[1] as HTMLInputElement;
                //     el.focus();
                //   }
                // }
                this.el.appendChild(inheritIconEl);
                this.el.appendChild(this.icon.getElement());
                this.el.onclick = () => {
                    const els = document.getElementsByClassName(templates_2.ClassNames.MONSTER_SELECTOR);
                    if (els.length) {
                        const el = els[0];
                        el.focus();
                    }
                };
                this.el.appendChild(this.latentIcon.getElement());
                this.setId(id);
            }
            getElement() {
                return this.el;
            }
            setId(id) {
                if (id >= 0 && !(ilmina_stripped_3.floof.hasCard(id))) {
                    console.warn('Invalid monster id: ' + String(id));
                    return;
                }
                this.id = id;
                this.transformedTo = -1;
                if (id == -1) {
                    this.level = 1;
                    this.awakenings = 0;
                    this.latents.length = 0;
                    this.superAwakeningIdx = -1;
                    this.setHpPlus(0);
                    this.setAtkPlus(0);
                    this.setRcvPlus(0);
                    return;
                }
                const c = this.getCard();
                // Change to monster's max level.
                this.setLevel(templates_2.SETTINGS.getNumber(common_4.NumberSetting.MONSTER_LEVEL));
                // Change to monster's max awakening level.
                this.awakenings = c.awakenings.length;
                // Attempt to copy the current latents.
                const latentCopy = this.latents;
                this.latents = [];
                for (const latent of latentCopy) {
                    this.addLatent(latent);
                }
                // If c has the same SA as our current one, keep that.
                if (this.superAwakeningIdx > -1 && c) {
                    const currentSa = c.superAwakenings[this.superAwakeningIdx];
                    if (c.superAwakenings.some((sa) => sa == currentSa)) {
                        this.superAwakeningIdx = c.superAwakenings.indexOf(currentSa);
                    }
                    else {
                        this.superAwakeningIdx = -1;
                    }
                }
                else {
                    this.superAwakeningIdx = -1;
                }
                if (ilmina_stripped_3.CardAssets.canPlus(c)) {
                    this.setHpPlus(99);
                    this.setAtkPlus(99);
                    this.setRcvPlus(99);
                }
                else {
                    this.setHpPlus(0);
                    this.setAtkPlus(0);
                    this.setRcvPlus(0);
                    this.inheritId = -1;
                }
            }
            getId(ignoreTransform = false) {
                if (!ignoreTransform && this.transformedTo > 0) {
                    return this.transformedTo;
                }
                return this.id;
            }
            getRenderData(playerMode, showSwap = false) {
                const plusses = this.hpPlus + this.atkPlus + this.rcvPlus;
                return {
                    plusses,
                    // A monster must be above level 99, max plussed, and in solo play for
                    // SAs to be active.  This will change later when 3P allows SB.
                    unavailableReason: [
                        playerMode == 2 ? '2P' : '',
                        plusses != 297 ? 'Unplussed' : '',
                        this.level < 100 ? 'Not Limit Broken' : '',
                    ].filter(Boolean).join(', '),
                    id: this.getId(),
                    awakenings: this.awakenings,
                    superAwakeningIdx: this.superAwakeningIdx,
                    level: this.level,
                    inheritId: this.inheritId,
                    inheritLevel: this.inheritLevel,
                    inheritPlussed: this.inheritPlussed,
                    latents: [...this.latents],
                    showSwap: showSwap,
                    showTransform: this.transformedTo > 0 || this.getCard().transformsTo > 0,
                    activeTransform: this.transformedTo > 0,
                };
            }
            update(playerMode = 1, data = undefined) {
                if (!data) {
                    data = this.getRenderData(playerMode);
                }
                this.icon.update({
                    id: data.id,
                    plusses: data.plusses,
                    awakening: data.awakenings,
                    superAwakeningIdx: data.superAwakeningIdx,
                    unavailableReason: data.unavailableReason,
                    level: data.level,
                    showSwap: data.showSwap,
                    showTransform: data.showTransform,
                    activeTransform: data.activeTransform,
                });
                this.inheritIcon.update(data.inheritId, data.inheritLevel, data.inheritPlussed);
                this.latentIcon.update([...data.latents]);
            }
            toJson() {
                const json = {};
                if (this.id >= 0) {
                    json.id = this.id;
                    if (this.level > 1) {
                        json.level = this.level;
                    }
                    // TODO: Make max awakening default;
                    json.awakenings = this.awakenings;
                    if (this.latents.length) {
                        json.latents = [...this.latents];
                    }
                    if (this.hpPlus) {
                        json.hpPlus = this.hpPlus;
                    }
                    if (this.atkPlus) {
                        json.atkPlus = this.atkPlus;
                    }
                    if (this.rcvPlus) {
                        json.rcvPlus = this.rcvPlus;
                    }
                    if (this.inheritId >= 0) {
                        json.inheritId = this.inheritId;
                        json.inheritLevel = this.inheritLevel;
                        json.inheritPlussed = this.inheritPlussed;
                    }
                    if (this.superAwakeningIdx >= 0) {
                        json.superAwakeningIdx = this.superAwakeningIdx;
                    }
                }
                return json;
            }
            getCard(ignoreTransform = false) {
                const id = this.getId(ignoreTransform);
                return ilmina_stripped_3.floof.getCard(id);
            }
            getInheritCard() {
                return ilmina_stripped_3.floof.getCard(this.inheritId);
            }
            toPdchu() {
                let string = '';
                if (ilmina_stripped_3.floof.hasCard(this.id)) {
                    string += String(this.id);
                }
                else {
                    string += 'sdr';
                }
                const card = this.getCard();
                const inherit = this.getInheritCard();
                if (inherit) {
                    string += ` (${this.inheritId}`;
                    if (inherit.attribute == card.attribute) {
                        let stats = ' |';
                        if (this.inheritLevel != 1) {
                            stats += ` lv${this.inheritLevel}`;
                        }
                        if (this.inheritPlussed) {
                            stats += ' +297';
                        }
                        if (stats.length > 2) {
                            string += stats;
                        }
                    }
                    string += ')';
                }
                if (this.latents.length) {
                    const counts = new Map();
                    for (const latent of this.latents) {
                        const name = LatentToPdchu.get(latent) || 'sdr';
                        counts.set(name, (counts.get(name) || 0) + 1);
                    }
                    string += '[';
                    for (const name of counts.keys()) {
                        if (counts.get(name) == 1) {
                            string += name + ',';
                        }
                        else {
                            string += name + `*${counts.get(name)},`;
                        }
                    }
                    string = string.substring(0, string.length - 1) + ']';
                }
                let stats = ' |';
                if (this.level != card.maxLevel) {
                    stats += ` lv${this.level}`;
                }
                if (this.awakenings != card.awakenings.length) {
                    stats += ` aw${this.awakenings}`;
                }
                if (this.hpPlus == 0 && this.atkPlus == 0 && this.rcvPlus == 0) {
                    stats += ' +0';
                }
                else if (this.hpPlus != 99 || this.atkPlus != 99 || this.rcvPlus != 99) {
                    stats += ` +H${this.hpPlus} +A${this.atkPlus} +R${this.rcvPlus}`;
                }
                if (this.superAwakeningIdx >= 0) {
                    stats += ` sa${this.superAwakeningIdx + 1}`;
                }
                if (stats.length > 2) {
                    string += stats;
                }
                return string;
            }
            fromPdchu(str) {
                let s = str.trim().toLowerCase();
                let assistPlussed = templates_2.SETTINGS.getBool(common_4.BoolSetting.INHERIT_PLUSSED);
                let assistLevel = templates_2.SETTINGS.getNumber(common_4.NumberSetting.INHERIT_LEVEL);
                let latents = [];
                let hpPlus = 99;
                let atkPlus = 99;
                let rcvPlus = 99;
                let awakeningLevel = 9;
                let superAwakeningIdx = -1;
                let level = templates_2.SETTINGS.getNumber(common_4.NumberSetting.MONSTER_LEVEL);
                const MONSTER_NAME_REGEX = /^\s*(("[^"]+")|[^([|]*)/;
                const ASSIST_REGEX = /\(\s*("[^"]*")?[^)]+\)/;
                const ASSIST_NAME_REGEX = /^\s*("[^"]+"|[^|]+)/;
                const LATENT_REGEX = /\[[^\]]*\]/;
                const monsterNameMatch = s.match(MONSTER_NAME_REGEX);
                if (!monsterNameMatch) {
                    return;
                }
                let monsterName = monsterNameMatch[0].trim();
                if (monsterName.startsWith('"')) {
                    monsterName = monsterName.substring(1);
                }
                if (monsterName.endsWith('"')) {
                    monsterName = monsterNameMatch[0].substring(0, monsterName.length - 1);
                }
                // Remove monster name.
                s = s.replace(monsterNameMatch[0], '');
                // Handle assist.
                let assistName = '';
                const assistMatch = s.match(ASSIST_REGEX);
                if (assistMatch) {
                    let assistString = assistMatch[0].substring(1, assistMatch[0].length - 1).trim();
                    const assistNameMatch = assistString.match(ASSIST_NAME_REGEX);
                    if (assistNameMatch) {
                        assistName = assistNameMatch[0].trim();
                        if (assistName.startsWith('"')) {
                            assistName = assistName.substring(1);
                        }
                        if (assistName.endsWith('"')) {
                            assistName = assistName.substring(0, assistName.length - 1);
                        }
                        const pieces = assistString.replace(assistNameMatch[0], '').split('|');
                        if (pieces.length > 1) {
                            const assistStatString = pieces.slice(1).join('');
                            const lvMatch = assistStatString.match(/lv\d+/);
                            if (lvMatch) {
                                assistLevel = Number(lvMatch[0].substring(2));
                            }
                            const plusMatch = assistStatString.match(/\+297/);
                            if (plusMatch) {
                                assistPlussed = true;
                            }
                        }
                    }
                    s = s.replace(assistMatch[0], '').trim();
                }
                let latentMatch = s.match(LATENT_REGEX);
                if (latentMatch) {
                    const latentPieces = latentMatch[0]
                        .substring(1, latentMatch[0].length - 1)
                        .trim()
                        .split(',')
                        .map((piece) => piece.trim())
                        .filter((a) => a.length > 0);
                    for (const piece of latentPieces) {
                        const latentMatch = piece.match(/\w+\+?/);
                        if (!latentMatch) {
                            continue;
                        }
                        const latentName = latentMatch[0];
                        let latent = PdchuToLatent.get(String(latentName)) || common_4.Latent.SDR;
                        if (latent == undefined) {
                            continue;
                        }
                        if (piece.includes('*')) {
                            for (let i = 0; i < Number(piece[piece.length - 1]); i++) {
                                latents.push(latent);
                            }
                        }
                        else {
                            latents.push(latent);
                        }
                    }
                    s.replace(latentMatch[0], '');
                }
                // Handle Stats.
                if (s.includes('|')) {
                    s = s.substring(s.indexOf('|'));
                    const saMatch = s.match(/sa\d/);
                    if (saMatch) {
                        superAwakeningIdx = Number(saMatch[0].substring(2)) - 1;
                        level = 110;
                    }
                    const lvMatch = s.match(/lv\d+/);
                    if (lvMatch) {
                        level = Number(lvMatch[0].substring(2));
                    }
                    const awakeningMatch = s.match(/aw\d/);
                    if (awakeningMatch) {
                        awakeningLevel = Number(awakeningMatch[0].substring(2));
                    }
                    const plusMatch = s.match(/\+0/);
                    if (plusMatch) {
                        hpPlus = 0;
                        atkPlus = 0;
                        rcvPlus = 0;
                    }
                    const plusHpMatch = s.match(/\+h\d+/);
                    if (plusHpMatch) {
                        hpPlus = Number(plusHpMatch[0].substring(2));
                    }
                    const plusAtkMatch = s.match(/\+a\d+/);
                    if (plusAtkMatch) {
                        atkPlus = Number(plusAtkMatch[0].substring(2));
                    }
                    const plusRcvMatch = s.match(/\+r\d+/);
                    if (plusRcvMatch) {
                        rcvPlus = Number(plusRcvMatch[0].substring(2));
                    }
                }
                const bestGuessIds = fuzzy_search_2.fuzzyMonsterSearch(monsterName, 20, fuzzy_search_2.prioritizedMonsterSearch);
                if (bestGuessIds.length == 0) {
                    console.warn('No Monsters matched');
                    return;
                }
                this.inheritPlussed = assistPlussed;
                this.inheritLevel = assistLevel;
                this.latents.length = 0;
                this.setId(bestGuessIds[0]);
                this.superAwakeningIdx = superAwakeningIdx;
                this.setLevel(level);
                for (const latent of latents) {
                    this.addLatent(/** @type {!Latent}*/ (latent));
                }
                if (bestGuessIds[0] != -1) {
                    this.setHpPlus(hpPlus);
                    this.setAtkPlus(atkPlus);
                    this.setRcvPlus(rcvPlus);
                    this.awakenings = Math.min(ilmina_stripped_3.floof.getCard(bestGuessIds[0]).awakenings.length, awakeningLevel);
                }
                if (assistName) {
                    const bestGuessInheritIds = fuzzy_search_2.fuzzyMonsterSearch(assistName, 20, fuzzy_search_2.prioritizedInheritSearch);
                    if (bestGuessInheritIds.length == 0) {
                        this.inheritId = -1;
                        console.warn('No inherits matched');
                    }
                    else {
                        this.inheritId = bestGuessInheritIds[0];
                        const inheritCard = this.getInheritCard();
                        if (inheritCard) {
                            this.inheritLevel = Math.min(this.inheritLevel, inheritCard.isLimitBreakable ? 110 : inheritCard.maxLevel);
                            const card = this.getCard();
                            if (card.attribute != inheritCard.attribute) {
                                this.inheritLevel = 1;
                                this.inheritPlussed = false;
                            }
                        }
                    }
                }
                else {
                    this.inheritId = -1;
                }
            }
            isSuperAwakeningActive(playerMode) {
                return (playerMode != 2 && this.level > 99 && this.hpPlus == 99
                    && this.atkPlus == 99 && this.hpPlus == 99);
            }
            getAwakenings(playerMode, filterSet, ignoreTransform = false) {
                let filterFn = (_awakening) => true;
                if (filterSet) {
                    filterFn = (awakening) => filterSet.has(awakening);
                }
                const c = this.getCard(ignoreTransform);
                let awakenings = c.awakenings.slice(0, this.awakenings);
                // A transformed monster is always fully awoken.
                if (this.transformedTo > 0) {
                    awakenings = [...c.awakenings];
                }
                if (this.isSuperAwakeningActive(playerMode) && this.superAwakeningIdx > -1) {
                    awakenings.push(c.superAwakenings[this.superAwakeningIdx]);
                }
                const inherit = this.getInheritCard();
                if (inherit && inherit.awakenings.length && inherit.awakenings[0] == common_4.Awakening.AWOKEN_ASSIST) {
                    for (const a of inherit.awakenings) {
                        awakenings.push(a);
                    }
                }
                return awakenings.filter(filterFn);
            }
            countAwakening(awakening, playerMode = 1, ignoreTransform = false) {
                let count = this.getAwakenings(playerMode, new Set([awakening]), ignoreTransform).length;
                let plusInfo = common_4.AwakeningToPlus.get(awakening);
                if (plusInfo) {
                    count += plusInfo.multiplier * this.getAwakenings(playerMode, new Set([plusInfo.awakening]), ignoreTransform).length;
                }
                return count;
            }
            getLatents(filterSet = null) {
                let filterFn = (_latent) => true;
                if (filterSet) {
                    filterFn = (latent) => filterSet.has(latent);
                }
                return this.latents.filter(filterFn);
            }
            calcScaleStat(max, min, growth) {
                return calcScaleStat(this.getCard(), max, min, this.level, growth);
            }
            addLatent(latent) {
                const c = this.getCard(true);
                // Only monsters capable of taking latent killers can take latents.
                if (!c.latentKillers.length) {
                    return;
                }
                const maxSlots = c.inheritanceType & 32 ? 8 : 6;
                let totalSlots = 0;
                for (const l of this.latents.concat(latent)) {
                    if (l < 11) {
                        totalSlots += 1;
                    }
                    else if (l < 33) {
                        totalSlots += 2;
                    }
                    else {
                        totalSlots += 6;
                    }
                }
                if (totalSlots > maxSlots)
                    return;
                if (latent >= 16 && latent <= 23 && !c.latentKillers.some((killer) => killer == (latent - 11))) {
                    return;
                }
                this.latents.push(latent);
            }
            removeLatent(latentIdx) {
                if (latentIdx >= this.latents.length) {
                    console.warn(`latent index out of range: ${latentIdx}`);
                    return;
                }
                this.latents = [...this.latents.slice(0, latentIdx), ...this.latents.slice(latentIdx + 1)];
            }
            setLevel(v) {
                v = Math.round(v);
                const c = this.getCard();
                if (v < 1) {
                    v = 1;
                }
                const maxLevel = c.isLimitBreakable ? 110 : c.maxLevel;
                if (v > maxLevel) {
                    v = maxLevel;
                }
                this.level = v;
            }
            setHpPlus(v) {
                this.hpPlus = validatePlus(v);
            }
            setAtkPlus(v) {
                this.atkPlus = validatePlus(v);
            }
            setRcvPlus(v) {
                this.rcvPlus = validatePlus(v);
            }
            getHp(playerMode = 1, awakeningsActive = true) {
                if (this.id == -1) {
                    return 0;
                }
                const c = this.getCard();
                let hp = this.calcScaleStat(c.maxHp, c.minHp, c.hpGrowth);
                if (awakeningsActive) {
                    let latentMultiplier = 1;
                    for (const latent of this.getLatents(new Set([common_4.Latent.HP, common_4.Latent.HP_PLUS, common_4.Latent.ALL_STATS]))) {
                        latentMultiplier += LatentHp.get(latent) || 0;
                    }
                    hp *= latentMultiplier;
                    let awakeningAdder = 0;
                    for (const awakening of this.getAwakenings(playerMode, new Set([common_4.Awakening.HP, common_4.Awakening.HP_MINUS]))) {
                        awakeningAdder += AWAKENING_BONUS.get(awakening) || 0;
                    }
                    hp += awakeningAdder;
                }
                const plusAdder = this.hpPlus * 10;
                hp += plusAdder;
                const inherit = this.getInheritCard();
                if (inherit && c.attribute == inherit.attribute) {
                    const inheritBonus = calcScaleStat(inherit, inherit.maxHp, inherit.minHp, this.inheritLevel, inherit.hpGrowth) + (this.inheritPlussed ? 990 : 0);
                    hp += Math.round(inheritBonus * 0.1);
                }
                if (playerMode > 1 && awakeningsActive) {
                    const multiboostMultiplier = 1.5 ** this.countAwakening(common_4.Awakening.MULTIBOOST, playerMode);
                    hp *= multiboostMultiplier;
                }
                return Math.max(Math.round(hp), 1);
            }
            getAtk(playerMode = 1, awakeningsActive = true) {
                if (this.id == -1) {
                    return 0;
                }
                const c = this.getCard();
                let atk = this.calcScaleStat(c.maxAtk, c.minAtk, c.atkGrowth);
                if (awakeningsActive) {
                    let latentMultiplier = 1;
                    for (const latent of this.getLatents(new Set([common_4.Latent.ATK, common_4.Latent.ATK_PLUS, common_4.Latent.ALL_STATS]))) {
                        latentMultiplier += LatentAtk.get(latent) || 0;
                    }
                    atk *= latentMultiplier;
                    let awakeningAdder = 0;
                    for (const awakening of this.getAwakenings(playerMode, new Set([common_4.Awakening.ATK, common_4.Awakening.ATK_MINUS]))) {
                        awakeningAdder += AWAKENING_BONUS.get(awakening) || 0;
                    }
                    atk += awakeningAdder;
                }
                const plusAdder = this.atkPlus * 5;
                atk += plusAdder;
                const inherit = this.getInheritCard();
                if (inherit && c.attribute == inherit.attribute) {
                    const inheritBonus = calcScaleStat(inherit, inherit.maxAtk, inherit.minAtk, this.inheritLevel, inherit.atkGrowth) + (this.inheritPlussed ? 495 : 0);
                    atk += Math.round(inheritBonus * 0.05);
                }
                atk = Math.round(atk);
                if (playerMode > 1 && awakeningsActive) {
                    const multiboostMultiplier = 1.5 ** this.countAwakening(common_4.Awakening.MULTIBOOST, playerMode);
                    atk *= multiboostMultiplier;
                }
                return Math.max(Math.round(atk), 1);
            }
            getRcv(playerMode = 1, awakeningsActive = true) {
                const c = this.getCard();
                let rcv = this.calcScaleStat(c.maxRcv, c.minRcv, c.rcvGrowth);
                if (awakeningsActive) {
                    let latentMultiplier = 1;
                    for (const latent of this.getLatents(new Set([common_4.Latent.RCV, common_4.Latent.RCV_PLUS, common_4.Latent.ALL_STATS]))) {
                        latentMultiplier += LatentRcv.get(latent) || 0;
                    }
                    rcv *= latentMultiplier;
                    const rcvSet = new Set([common_4.Awakening.RCV, common_4.Awakening.RCV_MINUS]);
                    let total = 0;
                    for (const awakening of this.getAwakenings(playerMode, rcvSet)) {
                        total += AWAKENING_BONUS.get(awakening) || 0;
                    }
                    rcv += total;
                }
                const plusAdder = this.rcvPlus * 3;
                rcv += plusAdder;
                const inherit = this.getInheritCard();
                if (inherit && c.attribute == inherit.attribute) {
                    const inheritBonus = calcScaleStat(inherit, inherit.maxRcv, inherit.minRcv, this.inheritLevel, inherit.rcvGrowth) + (this.inheritPlussed ? 297 : 0);
                    rcv += Math.round(inheritBonus * 0.15);
                }
                if (playerMode > 1 && awakeningsActive) {
                    const multiboostMultiplier = 1.5 ** this.countAwakening(common_4.Awakening.MULTIBOOST, playerMode);
                    rcv *= multiboostMultiplier;
                }
                return Math.round(rcv);
            }
            getAttribute() {
                if (this.attribute != common_4.Attribute.NONE) {
                    return this.attribute;
                }
                return this.getCard().attribute;
            }
            getSubattribute() {
                const c = this.getCard();
                if (c.subattribute == common_4.Attribute.NONE) {
                    return common_4.Attribute.NONE;
                }
                if (this.attribute != common_4.Attribute.NONE) {
                    return this.attribute;
                }
                return c.subattribute;
            }
            isType(t) {
                return this.getCard().types.some((type) => type == t);
            }
            anyTypes(t) {
                return t.some((type) => this.isType(type));
            }
            isAttribute(a) {
                const c = this.getCard();
                return c.attribute == a || c.subattribute == a;
            }
            anyAttributes(a) {
                return a.some((attr) => this.isAttribute(attr));
            }
            anyAttributeTypeBits(attrBits, typeBits) {
                return this.anyAttributes(common_4.idxsFromBits(attrBits)) || this.anyTypes(common_4.idxsFromBits(typeBits));
            }
            fromJson(json) {
                // const monster = new MonsterInstance(json.id || -1);
                this.setId(json.id || -1);
                this.level = json.level || 1;
                this.awakenings = json.awakenings || 1;
                this.latents = [...(json.latents || [])];
                if (json.superAwakeningIdx == null || json.superAwakeningIdx == undefined) {
                    this.superAwakeningIdx = -1;
                }
                else {
                    this.superAwakeningIdx = json.superAwakeningIdx;
                }
                this.setHpPlus(json.hpPlus || 0);
                this.setAtkPlus(json.atkPlus || 0);
                this.setRcvPlus(json.rcvPlus || 0);
                this.inheritId = json.inheritId || -1;
                this.inheritLevel = json.inheritLevel || 1;
                this.inheritPlussed = json.inheritPlussed || false;
            }
            // TODO: Consider loading this like a fromJson.
            copyFrom(otherInstance) {
                this.fromJson(otherInstance.toJson());
                // this.level = otherInstance.level;
                // this.awakenings = otherInstance.awakenings;
                // this.latents = [...otherInstance.latents];
                // this.superAwakeningIdx = otherInstance.superAwakeningIdx;
                // this.hpPlus = otherInstance.hpPlus;
                // this.atkPlus = otherInstance.atkPlus;
                // this.rcvPlus = otherInstance.rcvPlus;
                //
                // this.inheritId = otherInstance.inheritId;
                // this.inheritLevel = otherInstance.inheritLevel;
                // this.inheritPlussed = otherInstance.inheritPlussed;
                // this.setId(otherInstance.id);
            }
            getCooldown() {
                const skillId = this.getCard().activeSkillId;
                return skillId ? ilmina_stripped_3.floof.getPlayerSkill(skillId).maxCooldown : 0;
            }
            getCooldownInherit() {
                const inherit = this.getInheritCard();
                const inheritSkillId = inherit ? inherit.activeSkillId : 0;
                return this.getCooldown() + (inheritSkillId ? ilmina_stripped_3.floof.getPlayerSkill(inheritSkillId).maxCooldown : 0);
            }
            static swap(instanceA, instanceB) {
                const temp = new MonsterInstance();
                temp.copyFrom(instanceA);
                instanceA.copyFrom(instanceB);
                instanceB.copyFrom(temp);
            }
            makeTestContext(playerMode) {
                const skillId = this.getCard().activeSkillId;
                const CD_MAX = skillId ? ilmina_stripped_3.floof.getPlayerSkill(skillId).initialCooldown : 0;
                const inherit = this.getInheritCard();
                const inheritSkillId = inherit ? inherit.activeSkillId : 0;
                return {
                    ID: this.getId(),
                    ATTRIBUTE: (this.getAttribute() >= 0) ? 1 << this.getAttribute() : 0,
                    SUBATTRIBUTE: (this.getSubattribute() >= 0) ? 1 << this.getSubattribute() : 0,
                    HP: this.getHp(playerMode),
                    ATK: this.getAtk(playerMode),
                    RCV: this.getRcv(playerMode),
                    CD: this.getCooldown(),
                    CD_MAX,
                    INHERIT_CD: this.getCooldownInherit(),
                    INHERIT_CD_MAX: CD_MAX + (inheritSkillId ? ilmina_stripped_3.floof.getPlayerSkill(inheritSkillId).initialCooldown : 0),
                    SDR: this.latents.filter((l) => l == common_4.Latent.SDR).length,
                };
            }
        }
        exports.MonsterInstance = MonsterInstance;
    });
    define("damage_ping", ["require", "exports", "common"], function (require, exports, common_5) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class DamagePing {
            constructor(source, attribute, isSub = false) {
                this.isSub = false;
                this.isActive = false;
                this.ignoreVoid = false;
                this.ignoreDefense = false;
                this.damage = 0;
                this.rawDamage = 0;
                this.actualDamage = 0;
                this.source = source;
                this.attribute = attribute;
                this.isSub = isSub;
            }
            add(amount) {
                this.damage += amount;
            }
            multiply(multiplier, round = common_5.Round.NEAREST) {
                this.damage = round(this.damage * multiplier);
            }
        }
        exports.DamagePing = DamagePing;
    });
    define("combo_container", ["require", "exports", "common", "templates"], function (require, exports, common_6, templates_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Combo {
            constructor(count, attribute, enhanced = 0, shape) {
                this.count = count;
                this.attribute = attribute;
                if (enhanced > count) {
                    enhanced = count;
                }
                this.enhanced = enhanced;
                if (shape == common_6.Shape.L && count != 5 ||
                    shape == common_6.Shape.COLUMN && (count < 4 || count > 6) ||
                    shape == common_6.Shape.CROSS && count != 5 ||
                    shape == common_6.Shape.BOX && count != 9 ||
                    shape == common_6.Shape.ROW && count < 5) {
                    console.warn(`Invalid Shape and count combination. Changing shape to AMORPHOUS`);
                    shape = common_6.Shape.AMORPHOUS;
                }
                this.shape = shape;
            }
            recount() {
                if (this.shape == common_6.Shape.L || this.shape == common_6.Shape.CROSS) {
                    this.count = 5;
                }
                if (this.shape == common_6.Shape.BOX) {
                    this.count = 9;
                }
                if (this.shape == common_6.Shape.COLUMN) {
                    console.warn('TODO: Handle auto changing to column');
                }
                if (this.enhanced > this.count) {
                    this.enhanced = this.count;
                }
            }
        }
        exports.Combo = Combo;
        class ComboContainer {
            constructor() {
                // boardWidth: number;
                this.boardWidthTeam = () => 5;
                this.boardWidthDungeon = () => 6;
                // private readonly maxVisibleCombos = 14;
                this.bonusCombosLeader = 0;
                this.bonusCombosActive = 0;
                this.bonusCombosOrb = 0;
                this.combos = {};
                for (const c of common_6.COLORS) {
                    this.combos[c] = [];
                }
                this.onUpdate = [];
                this.comboEditor = new templates_3.ComboEditor();
                this.comboEditor.plusComboActiveInput.onchange = () => {
                    this.bonusCombosActive = parseInt(this.comboEditor.plusComboActiveInput.value);
                    this.update();
                };
                this.comboEditor.commandInput.onkeyup = (e) => {
                    if (e.keyCode == 13) {
                        const remainingCommands = this.doCommands(this.comboEditor.commandInput.value);
                        this.comboEditor.commandInput.value = remainingCommands.join(' ');
                    }
                };
                this.comboEditor.onComboClick = (c, idx) => {
                    this.delete(`${c}${idx}`);
                    this.update();
                };
                this.boardWidthStatus = () => parseInt(this.comboEditor.boardWidthInput.value);
                this.comboEditor.boardWidthInput.onchange = () => {
                    this.update();
                };
            }
            getElement() {
                return this.comboEditor.getElement();
            }
            doCommands(cmdsString) {
                const cmds = cmdsString.split(' ')
                    .map((c) => c.trim())
                    .filter((c) => Boolean(c));
                let executed = 0;
                for (const i in cmds) {
                    if (!this.doCommand(cmds[i])) {
                        break;
                    }
                    executed++;
                }
                this.update();
                return cmds.slice(executed);
            }
            doCommand(cmd) {
                if (cmd == 'D') {
                    return this.doCommand('Daa');
                }
                if (cmd.startsWith('Da') || cmd.startsWith('DA')) {
                    return this.deleteAll(cmd.substring(2));
                }
                if (cmd.startsWith('D')) {
                    return this.delete(cmd.substring(1));
                }
                if ('XCLBR'.indexOf(cmd[0]) >= 0) {
                    return this.addShape(cmd[0], cmd.substring(1));
                }
                let maybeMatch = cmd.match(/^\d+/);
                if (maybeMatch) {
                    let count = Number(maybeMatch[0]);
                    cmd = cmd.substring(maybeMatch[0].length);
                    if (!cmd) {
                        // Requires at least one color.
                        return false;
                    }
                    return this.add(count, cmd);
                }
                if (cmd[0] in this.combos) {
                    return this.add(3, cmd);
                }
                return false;
            }
            addShape(shape, cmd) {
                let count = 3;
                const maybeCount = cmd.match(/^\d+/);
                if (maybeCount) {
                    count = Number(maybeCount[0]);
                    cmd = cmd.substring(maybeCount[0].length);
                }
                switch (shape) {
                    case 'R':
                        count = Math.max(count, this.boardWidth());
                        break;
                    case 'C':
                        count = this.boardWidth() - 1;
                        break;
                    case 'L':
                    case 'X':
                        count = 5;
                        break;
                    case 'B':
                        count = 9;
                        break;
                }
                return this.add(count, cmd, common_6.LetterToShape[shape] || common_6.Shape.AMORPHOUS);
            }
            add(count, cmd, shape = common_6.Shape.AMORPHOUS) {
                if (count < 3) {
                    count = 3;
                }
                let added = false;
                while (cmd) {
                    if (!(cmd[0] in this.combos)) {
                        break;
                    }
                    const c = cmd[0];
                    let e = 0;
                    cmd = cmd.substring(1);
                    const maybeEnhance = cmd.match(/^\d+/);
                    if (maybeEnhance) {
                        e = Number(maybeEnhance[0]);
                        cmd = cmd.substring(maybeEnhance[0].length);
                    }
                    this.combos[c].push(new Combo(count, common_6.COLORS.indexOf(c), e, shape));
                    added = true;
                }
                if (cmd) {
                    console.warn('Unused values in cmd: ' + cmd);
                }
                return added;
            }
            // TODO
            delete(cmd) {
                let colorsToDelete = [];
                while (cmd && cmd[0] in this.combos) {
                    colorsToDelete.push(cmd[0]);
                    cmd = cmd.substring(1);
                }
                let idxToDelete = 1;
                let fromEnd = true;
                if (cmd) {
                    if (cmd[0] == '-') {
                        fromEnd = true;
                        cmd = cmd.substring(1);
                    }
                    else {
                        fromEnd = false;
                    }
                    const maybeIdx = cmd.match(/^\d+/);
                    if (maybeIdx) {
                        cmd = cmd.substring(maybeIdx[0].length);
                        idxToDelete = Number(maybeIdx[0]);
                    }
                    if (cmd) {
                        console.log(`Unused delete args: ${cmd}`);
                    }
                }
                let anyDeleted = false;
                for (const c of colorsToDelete) {
                    const idx = fromEnd ? this.combos[c].length - idxToDelete : idxToDelete - 0;
                    if (idx >= 0 && idx < this.combos[c].length) {
                        this.combos[c].splice(idx, 1);
                        anyDeleted = true;
                        console.log(`Deleting from ${c}, combo #${idx}`);
                    }
                    else {
                        console.warn(`Index out of bounds: ${idx}`);
                    }
                }
                return anyDeleted;
            }
            deleteAll(cmd) {
                if (cmd[0].toLowerCase() == 'a') {
                    for (const c in this.combos) {
                        this.combos[c].length = 0;
                    }
                    return true;
                }
                // Assume to delete all color values present.
                for (const c of cmd) {
                    if (!(c in this.combos)) {
                        console.warn('Not valid color: ' + c);
                    }
                    this.combos[c].length = 0;
                }
                return true;
            }
            update() {
                const data = {};
                for (const c in this.combos) {
                    data[c] = this.combos[c].map((combo) => {
                        let countString = common_6.ShapeToLetter[combo.shape];
                        if (combo.shape == common_6.Shape.AMORPHOUS) {
                            countString = `${combo.count}`;
                        }
                        if (combo.shape == common_6.Shape.ROW || combo.shape == common_6.Shape.COLUMN) {
                            countString += `${combo.count}`;
                        }
                        return {
                            shapeCount: countString,
                            enhance: combo.enhanced,
                        };
                    });
                }
                this.comboEditor.update(data, this.boardWidth(), this.getRemainingOrbs());
                for (const fn of this.onUpdate) {
                    fn(this);
                }
                this.updateEditor();
                this.comboEditor.plusComboActiveInput.value = String(this.bonusCombosActive);
            }
            setBonusComboLeader(bonus) {
                this.bonusCombosLeader = bonus;
                this.updateEditor();
                this.comboEditor.plusComboLeaderInput.value = String(this.bonusCombosLeader);
            }
            setBonusComboOrb(bonus) {
                if (bonus > 2) {
                    bonus = 2;
                }
                this.updateEditor();
                this.bonusCombosOrb = bonus;
                this.comboEditor.plusComboOrbInput.value = String(bonus);
            }
            comboCount() {
                let total = 0;
                for (const c in this.combos) {
                    total += this.combos[c].length;
                }
                return total + this.bonusCombosLeader + this.bonusCombosActive + this.bonusCombosOrb;
            }
            updateEditor() {
                this.comboEditor.totalCombo.innerText = `Total Combos: ${this.comboCount()}`;
            }
            getBoardSize() {
                return this.boardWidth() * (this.boardWidth() - 1);
            }
            boardWidth() {
                const status = this.boardWidthStatus();
                if (status) {
                    return status;
                }
                return Math.max(this.boardWidthTeam(), this.boardWidthDungeon());
            }
            getRemainingOrbs() {
                let remaining = this.getBoardSize();
                for (const colorCombos of Object.values(this.combos)) {
                    for (const combo of colorCombos) {
                        remaining -= combo.count;
                    }
                }
                return remaining > 0 ? remaining : 0;
            }
        }
        exports.ComboContainer = ComboContainer;
    });
    define("leaders", ["require", "exports", "common", "ilmina_stripped"], function (require, exports, common_7, ilmina_stripped_4) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function subs(team) {
            return team.slice(1, team.length - 1).filter((sub) => sub.getId() >= 0);
        }
        const atkFromAttr = {
            toString: ([attr, atk100]) => `${atk100 / 100}x ATK for ${common_7.AttributeToName.get(attr)}`,
            atk: ([attr, atk100], { ping }) => {
                return ping.source.isAttribute(attr) ? atk100 / 100 : 1;
            },
            atkMax: ([_, atk100]) => atk100 / 100,
        };
        const bonusAttackScale = {
            toString: ([scale]) => `${scale / 100}x bonus attack after matching orbs.`,
            bonusAttack: ([scale]) => scale / 100,
        };
        const autoHealLead = {
            toString: ([heal100]) => `${heal100 / 100}x healed after matching orbs.`,
            autoHeal: ([heal100]) => heal100 / 100,
        };
        const resolveLead = {
            toString: ([resolveMinPercent]) => `Survive single hit with 1HP if above ${resolveMinPercent}% HP.`,
            resolve: ([resolveMinPercent, UNKNOWN]) => {
                if (UNKNOWN) {
                    console.warn(`Unhandled second parameter of resolve: ${UNKNOWN}`);
                }
                return resolveMinPercent;
            },
        };
        const pureTimeExtend = {
            toString: ([sec100]) => `Increase movetime by ${sec100 / 100}s`,
            timeExtend: ([sec100]) => sec100 / 100,
        };
        const shieldAgainstAll = {
            toString: ([shield100]) => `${shield100}% damage reduction.`,
            damageMult: ([shield100]) => (1 - shield100 / 100),
            damageMultMax: ([shield100]) => (1 - shield100 / 100),
        };
        const shieldAgainstAttr = {
            toString: ([attr, shield100]) => `${shield100}% ${common_7.AttributeToName.get(attr)} damage reduction.`,
            damageMult: ([attr, shield100], { attribute }) => (attribute == attr) ? 1 - shield100 / 100 : 1,
            damageMultMax: ([_, shield100]) => 1 - shield100 / 100,
        };
        const atkFromType = {
            toString: ([type, atk100]) => `${atk100 / 100}x ATK for ${common_7.TypeToName.get(type)}.`,
            atk: ([type, atk100], { ping }) => ping.source.isType(type) ? atk100 / 100 : 1,
            atkMax: ([_, atk100]) => atk100 / 100,
        };
        const hpFromType = {
            toString: ([type, hp100]) => `${hp100 / 100}x HP for ${common_7.TypeToName.get(type)}.`,
            hp: ([type, hp100], { monster }) => monster.isType(type) ? hp100 / 100 : 1,
            hpMax: ([_, hp100]) => hp100 / 100,
        };
        const rcvFromType = {
            toString: ([type, rcv100]) => `${rcv100 / 100}x RCV for ${common_7.TypeToName.get(type)}`,
            rcv: ([type, rcv100], { monster }) => monster.isType(type) ? rcv100 / 100 : 1,
            rcvMax: ([_, rcv100]) => rcv100 / 100,
        };
        const atkUnconditional = {
            toString: ([atk100]) => `${atk100 / 100}x ATK.`,
            atk: ([atk100]) => atk100 / 100,
            atkMax: ([atk100]) => atk100 / 100,
        };
        const atkRcvFromAttr = {
            toString: ([attr, mult100]) => `${mult100 / 100}x ATK and RCV for ${common_7.AttributeToName.get(attr)}.`,
            atk: atkFromAttr.atk,
            rcv: ([attr, mult100], { monster }) => monster.isAttribute(attr) ? mult100 / 100 : 1,
            atkMax: ([_, mult100]) => mult100 / 100,
            rcvMax: ([_, mult100]) => mult100 / 100,
        };
        const baseStatFromAttr = {
            toString: ([attr, mult100]) => `${mult100 / 100}x HP, ATK, and RCV for ${common_7.AttributeToName.get(attr)}.`,
            hp: ([attr, mult100], { monster }) => monster.isAttribute(attr) ? mult100 / 100 : 1,
            atk: atkRcvFromAttr.atk,
            rcv: atkRcvFromAttr.rcv,
            hpMax: ([_, mult100]) => mult100 / 100,
            atkMax: atkRcvFromAttr.atkMax,
            rcvMax: atkRcvFromAttr.rcvMax,
        };
        const hpFromTwoTypes = {
            toString: ([type1, type2, hp100]) => `${hp100 / 100}x HP for ${common_7.TypeToName.get(type1)} and ${common_7.TypeToName.get(type2)}.`,
            hp: ([type1, type2, hp100], { monster }) => monster.anyTypes([type1, type2]) ? hp100 / 100 : 1,
            hpMax: ([_, _a, hp100]) => hp100 / 100,
        };
        const atkFromTwoTypes = {
            toString: ([type1, type2, atk100]) => `${atk100 / 100}x ATK for ${common_7.TypeToName.get(type1)} and ${common_7.TypeToName.get(type2)}.`,
            atk: ([type1, type2, atk100], { ping }) => ping.source.anyTypes([type1, type2]) ? atk100 / 100 : 1,
            atkMax: ([_, _a, atk100]) => atk100 / 100,
        };
        const drumSounds = {
            toString: () => 'Drum sounds will play.',
            drumEffect: true,
        };
        const shieldAgainstTwoAttr = {
            toString: ([attr1, attr2, shield100]) => `${shield100}% ${common_7.AttributeToName.get(attr1)} and ${common_7.AttributeToName.get(attr2)} damage reduction.`,
            damageMult: ([attr1, attr2, shield100], { attribute }) => (attribute == attr1 || attribute == attr2) ? 1 - shield100 / 100 : 1,
            damageMultMax: ([shield100]) => 1 - shield100 / 100,
        };
        const shieldFromHp = {
            toString: ([threshold, _, shield100]) => `${shield100}% damage reduction when above ${threshold}% HP.`,
            damageMult: ([threshold, UNKNOWN, shield100], { percentHp }) => {
                if (UNKNOWN) {
                    console.warn(`Unhandled parameter of shieldFromHp: ${UNKNOWN}`);
                }
                const mult = 1 - shield100 / 100;
                if (threshold == 100) {
                    return percentHp >= 100 ? mult : 1;
                }
                return percentHp <= threshold ? mult : 1;
            },
            damageMultMax: ([_, _a, shield100]) => 1 - shield100 / 100,
        };
        const atkRcvFromSubHp = {
            toString: ([thresh, atkFlag, rcvFlag, mult100]) => {
                const includes = [atkFlag && 'ATK', rcvFlag && 'RCV'].filter(Boolean).join(' and ');
                return `${mult100 / 100}x ${includes} when below ${thresh}% HP.`;
            },
            atk: ([thresh, atkFlag, _, mult100], { percentHp }) => atkFlag && (percentHp <= thresh) ? mult100 / 100 : 1,
            rcvPost: ([thresh, _, rcvFlag, mult100], { percentHp }) => rcvFlag && (percentHp <= thresh) ? mult100 / 100 : 1,
            atkMax: ([_, atkFlag, _a, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, _a, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        const atkFromTwoAttrs = {
            toString: ([attr1, attr2, atk100]) => `${atk100 / 100}x ATK for ${common_7.AttributeToName.get(attr1)} and ${common_7.AttributeToName.get(attr2)}.`,
            atk: ([attr1, attr2, atk100], { ping }) => ping.source.anyAttributes([attr1, attr2]) ? atk100 / 100 : 1,
            atkMax: ([_, _a, atk100]) => atk100 / 100,
        };
        const counterattack = {
            toString: ([chance, atk100, attr]) => {
                const base = `${atk100 / 100}x ${common_7.AttributeToName.get(attr)} counterattack.`;
                if (chance == 100) {
                    return base;
                }
                return `${chance}% chance of ` + base;
            },
            counter: ([chance, atk100, attr]) => {
                if (chance != 100) {
                    console.warn(`Chance of counterattacking: ${chance}%`);
                }
                return { attribute: attr, multiplier: atk100 / 100 };
            },
        };
        const shieldFromAboveHp = {
            toString: ([thresh, chance, shield100]) => {
                const base = `${shield100}% damage reduction when above ${thresh}% HP.`;
                if (chance == 100) {
                    return base;
                }
                return `${chance}% chance of ` + base;
            },
            damageMult: ([thresh, chance, shield100], { percentHp }) => {
                if (chance != 100) {
                    console.warn(`Chance of shield happening is ${chance}%`);
                }
                return percentHp >= thresh ? 1 - shield100 / 100 : 1;
            },
            damageMultMax: ([_, _a, shield100]) => 1 - shield100 / 100,
        };
        const atkRcvFromAboveHp = {
            toString: ([thresh, atkFlag, rcvFlag, mult100]) => {
                const includes = [atkFlag && 'ATK', rcvFlag && 'RCV'].filter(Boolean).join(' and ');
                return `${mult100 / 100}x ${includes} when above ${thresh}% HP.`;
            },
            atk: ([thresh, atkFlag, _, mult100], { percentHp }) => (atkFlag && percentHp >= thresh) ? mult100 / 100 : 1,
            rcvPost: ([thresh, _, rcvFlag, mult100], { percentHp }) => (rcvFlag && percentHp >= thresh) ? mult100 / 100 : 1,
            atkMax: ([_, atkFlag, _a, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, _a, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        // 45 see 28
        const hpFromTwoAttrs = {
            toString: ([attr1, attr2, hp100]) => `${hp100 / 100}x HP for ${common_7.AttributeToName.get(attr1)} and ${common_7.AttributeToName.get(attr2)}.`,
            hp: ([attr1, attr2, hp100], { monster }) => monster.anyAttributes([attr1, attr2]) ? hp100 / 100 : 1,
            hpMax: ([_, _a, hp100]) => hp100 / 100,
        };
        const hpFromAttr = {
            toString: ([attr, hp100]) => `${hp100 / 100}x HP for ${common_7.AttributeToName.get(attr)}.`,
            hp: ([attr, hp100], { monster }) => monster.isAttribute(attr) ? hp100 / 100 : 1,
            hpMax: ([_, hp100]) => hp100 / 100,
        };
        const rcvFromAttr = {
            toString: ([attr, rcv100]) => `${rcv100 / 100}x RCV for ${common_7.AttributeToName.get(attr)}.`,
            rcv: ([attr, rcv100], { monster }) => monster.isAttribute(attr) ? rcv100 : 100,
            rcvMax: ([_, rcv100]) => rcv100 / 100,
        };
        const dropBoost = {
            toString: ([boost100]) => `${boost100 / 100}x Drop Rate in Solo Mode.`,
            drop: ([boost100]) => boost100 / 100,
        };
        const coinBoost = {
            toString: ([coins100]) => `${coins100 / 100}x Coins.`,
            coins: ([coins100]) => coins100 / 100,
        };
        function countMatchedColors(attrBits, comboContainer, team) {
            const matchedAttr = common_7.idxsFromBits(attrBits)
                .filter((attr) => comboContainer.combos[common_7.COLORS[attr]].length)
                .filter((attr) => attr >= 5 || team.some((monster) => !monster.bound && (monster.getAttribute() == attr || monster.getSubattribute() == attr)));
            return matchedAttr.length;
        }
        const atkScalingFromUniqueColorMatches = {
            toString: ([attrBits, minColors, atk100base, atk100scale, moreColors]) => {
                const colors = common_7.idxsFromBits(attrBits).map((i) => common_7.AttributeToName.get(i));
                const base = `${atk100base}x ATK when matching at least ${minColors} of ${colors.join(', ')}`;
                moreColors = Math.min(moreColors, colors.length - minColors);
                if (!atk100scale || !moreColors) {
                    return base + '.';
                }
                return base + `, +${atk100scale / 100}x per color up to ${(atk100scale * moreColors + atk100base)}x at ${colors.length + moreColors}.`;
            },
            atk: ([attrBits, minColors, atk100base, atk100scale, moreColors], { team, comboContainer }) => {
                let count = countMatchedColors(attrBits, comboContainer, team);
                atk100scale = atk100scale || 0;
                const maxColors = minColors + (moreColors || 0);
                if (count < minColors) {
                    return 1;
                }
                if (count > maxColors) {
                    count = maxColors;
                }
                return (atk100base + (count - minColors) * atk100scale) / 100;
            },
            atkMax: ([attrBits, minColors, atk100base, atk100scale, moreColors]) => {
                // Because Stupid things like Aten has ridiculous scaling that doesn't make sense.
                // ie. moreColors is set to 100 for Aten, which should actually cap at 2.
                moreColors = Math.min(common_7.idxsFromBits(attrBits).length - minColors, moreColors || 0);
                return (atk100base + (atk100scale || 0) * moreColors) / 100;
            },
        };
        const atkHpFromType = {
            toString: ([type, mult100]) => `${mult100 / 100}x HP and ATK for ${common_7.TypeToName.get(type)}.`,
            hp: ([type, mult100], { monster }) => monster.isType(type) ? mult100 : 1,
            atk: ([type, mult100], { ping }) => ping.source.isType(type) ? mult100 : 1,
            hpMax: ([_, mult100]) => mult100 / 100,
            atkMax: ([_, mult100]) => mult100 / 100,
        };
        const hpRcvFromType = {
            toString: ([type, mult100]) => `${mult100 / 100}x HP and RCV for ${common_7.TypeToName.get(type)}.`,
            hp: hpFromType.hp,
            rcv: rcvFromType.rcv,
            hpMax: hpFromType.hpMax,
            rcvMax: rcvFromType.rcvMax,
        };
        const atkRcvFromType = {
            toString: ([type, mult100]) => `${mult100 / 100}x ATK and RCV for ${common_7.TypeToName.get(type)}.`,
            hp: hpFromType.hp,
            atk: atkFromType.atk,
            rcv: rcvFromType.rcv,
            hpMax: hpFromType.hpMax,
            atkMax: atkFromType.atkMax,
            rcvMax: rcvFromType.rcvMax,
        };
        const baseStatFromType = {
            toString: ([type, mult100]) => `${mult100 / 100}x HP, ATK, and RCV for ${common_7.TypeToName.get(type)}.`,
            hp: hpFromType.hp,
            atk: atkFromType.atk,
            rcv: rcvFromType.rcv,
            hpMax: hpFromType.hpMax,
            atkMax: atkFromType.atkMax,
            rcvMax: rcvFromType.rcvMax,
        };
        const atkFromCombos = {
            toString: ([minCombo, atk100]) => `${atk100 / 100}x ATK when matching ${minCombo}+ combos.`,
            atk: ([minCombo, atk100], { comboContainer }) => (comboContainer.comboCount() >= minCombo) ? atk100 / 100 : 1,
            atkMax: ([_, atk100]) => atk100 / 100,
        };
        const hpRcvFromAttr = {
            toString: ([attr, mult100]) => `${mult100 / 100}x HP and RCV for ${common_7.AttributeToName.get(attr)}.`,
            hp: hpFromAttr.hp,
            rcv: rcvFromAttr.rcv,
            hpMax: hpFromAttr.hpMax,
            rcvMax: rcvFromAttr.rcvMax,
        };
        const atkFromAttrType = {
            toString: ([attr, type, atk100]) => `${atk100 / 100}x ATK for ${common_7.AttributeToName.get(attr)} and ${common_7.TypeToName.get(type)}`,
            atk: ([attr, type, atk100], { ping }) => ping.source.isAttribute(attr) || ping.source.isType(type) ? atk100 / 100 : 1,
            atkMax: ([_, _a, atk100]) => atk100 / 100,
        };
        const atkHpFromAttrType = {
            toString: ([attr, type, mult100]) => `${mult100 / 100}x HP and ATK for ${common_7.AttributeToName.get(attr)} and ${common_7.TypeToName.get(type)}`,
            hp: ([attr, type, mult100], { monster }) => monster.isAttribute(attr) || monster.isType(type) ? mult100 / 100 : 1,
            atk: atkFromAttrType.atk,
            hpMax: ([_, _a, mult100]) => mult100 / 100,
            atkMax: atkFromAttrType.atkMax,
        };
        const atkRcvFromAttrType = {
            toString: ([attr, type, mult100]) => `${mult100 / 100}x ATK and RCV for ${common_7.AttributeToName.get(attr)} and ${common_7.TypeToName.get(type)}`,
            atk: atkFromAttrType.atk,
            rcv: ([attr, type, mult100], { monster }) => monster.isAttribute(attr) || monster.isType(type) ? mult100 / 100 : 1,
            atkMax: atkFromAttrType.atkMax,
            rcvMax: ([_, _a, mult100]) => mult100 / 100,
        };
        const baseStatFromAttrType = {
            toString: ([attr, type, mult100]) => `${mult100 / 100}x HP, ATK, and RCV for ${common_7.AttributeToName.get(attr)} and ${common_7.TypeToName.get(type)}`,
            hp: atkHpFromAttrType.hp,
            atk: atkFromAttrType.atk,
            rcv: atkRcvFromAttr.rcv,
            hpMax: atkHpFromAttrType.hpMax,
            atkMax: atkFromAttrType.atkMax,
            rcvMax: atkRcvFromAttr.rcvMax,
        };
        // 77 see 31
        const atkRcvFromTwoTypes = {
            atk: atkFromTwoTypes.atk,
            rcv: ([type1, type2, rcv100], { monster }) => monster.anyTypes([type1, type2]) ? rcv100 / 100 : 1,
            atkMax: atkFromTwoTypes.atkMax,
            rcvMax: ([_, _b, rcv100]) => rcv100 / 100,
        };
        const atkRcvFromAttrAndSubHp = {
            atk: ([thresh, attr, atkFlag, _, atk100], { ping, percentHp }) => {
                return atkFlag && thresh <= percentHp && ping.source.isAttribute(attr) ? atk100 / 100 : 1;
            },
            rcvPost: ([thresh, attr, _, rcvFlag, rcv100], { monster, percentHp }) => {
                return rcvFlag && thresh <= percentHp && monster.isAttribute(attr) ? rcv100 / 100 : 1;
            },
            atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        const atkRcvFromTypeAndSubHp = {
            atk: ([thresh, type, atkFlag, _, atk100], { ping, percentHp }) => {
                return atkFlag && thresh <= percentHp && ping.source.isType(type) ? atk100 / 100 : 1;
            },
            rcvPost: ([thresh, type, _, rcvFlag, rcv100], { monster, percentHp }) => {
                return rcvFlag && thresh <= percentHp && monster.isType(type) ? rcv100 / 100 : 1;
            },
            atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        const atkRcvFromAttrAndAboveHp = {
            atk: ([thresh, attr, atkFlag, _, atk100], { ping, percentHp }) => {
                return atkFlag && thresh >= percentHp && ping.source.isAttribute(attr) ? atk100 / 100 : 1;
            },
            rcvPost: ([thresh, attr, _, rcvFlag, rcv100], { monster, percentHp }) => {
                return rcvFlag && thresh >= percentHp && monster.isAttribute(attr) ? rcv100 / 100 : 1;
            },
            atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        const atkRcvFromTypeAndAboveHp = {
            atk: ([thresh, type, atkFlag, _, atk100], { ping, percentHp }) => {
                return atkFlag && thresh >= percentHp && ping.source.isType(type) ? atk100 / 100 : 1;
            },
            rcvPost: ([thresh, type, _, rcvFlag, rcv100], { monster, percentHp }) => {
                return rcvFlag && thresh >= percentHp && monster.isType(type) ? rcv100 / 100 : 1;
            },
            atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        const atkScalingFromCombos = {
            atk: ([minCombo, atk100base, atk100scale, maxCombo], { comboContainer }) => {
                let count = comboContainer.comboCount();
                if (count < minCombo) {
                    return 1;
                }
                if (count > maxCombo) {
                    count = maxCombo;
                }
                return (atk100base + (count - minCombo) * atk100scale) / 100;
            },
            atkMax: ([minCombo, atk100base, atk100scale, maxCombo]) => (atk100base + ((maxCombo || minCombo) - minCombo) * (atk100scale || 0)) / 100,
        };
        const atkRcvFromSkill = {
            atk: ([atkFlag, _, mult100], { skillUsed }) => atkFlag && skillUsed ? mult100 / 100 : 1,
            rcvPost: ([_, rcvFlag, mult100], { skillUsed }) => rcvFlag && skillUsed ? mult100 / 100 : 1,
            atkMax: ([atkFlag, _, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        const atkFromExactCombos = {
            atk: ([combos, atk100], { comboContainer }) => comboContainer.comboCount() == combos ? atk100 / 100 : 1,
            atkMax: ([_, atk100]) => atk100 / 100,
        };
        const atkRcvFromCombos = {
            atk: ([minCombo, atkFlag, _, atk100], { comboContainer }) => atkFlag && comboContainer.comboCount() >= minCombo ? atk100 / 100 : 1,
            rcvPost: ([minCombo, _, rcvFlag, rcv100], { comboContainer }) => rcvFlag && comboContainer.comboCount() >= minCombo ? rcv100 / 100 : 1,
            atkMax: ([_, atkFlag, _a, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, _a, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        const atkRcvFromAttrCombos = {
            atk: ([a, attrBits, b, c, d], ctx) => ctx.ping.source.anyAttributes(common_7.idxsFromBits(attrBits)) ? atkRcvFromCombos.atk([a, b, c, d], ctx) : 1,
            rcvPost: ([a, attrBits, b, c, d], ctx) => ctx.monster.anyAttributes(common_7.idxsFromBits(attrBits)) ? atkRcvFromCombos.rcv([a, b, c, d], ctx) : 1,
            atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
            rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
        };
        const atkFromDecreasedRcv = {
            atk: ([_, atk100]) => atk100 / 100,
            rcv: ([rcv100]) => rcv100 / 100,
            atkMax: ([_, atk100]) => atk100,
            rcvMax: ([rcv100]) => rcv100,
        };
        const atkFromDecreasedHp = {
            hp: ([hp100]) => hp100 / 100,
            atk: ([_, atk100]) => atk100 / 100,
            hpMax: ([hp100]) => hp100 / 100,
            atkMax: ([_, atk100]) => atk100 / 100,
        };
        const hpDecrease = {
            hp: ([hp100]) => hp100 / 100,
            hpMax: ([hp100]) => hp100 / 100,
        };
        const atkFromTypeDecreasedHp = {
            hp: ([hp100]) => hp100 / 100,
            atk: ([_, type, atk100], { ping }) => ping.source.isType(type) ? atk100 / 100 : 1,
            hpMax: ([hp100]) => hp100 / 100,
            atkMax: ([_, _a, atk100]) => atk100 / 100,
        };
        const atkFromLinkedOrbs = {
            atk: ([attrBits, minLinked, atk100], { comboContainer }) => common_7.idxsFromBits(attrBits).some((attr) => comboContainer.combos[common_7.COLORS[attr]].some((c) => c.count >= minLinked)) ? atk100 / 100 : 1,
            atkMax: ([_, _a, atk100]) => atk100 / 100,
        };
        const atkHpFromTwoAttrs = {
            hp: hpFromTwoAttrs.hp,
            atk: atkFromTwoAttrs.atk,
            hpMax: hpFromTwoAttrs.hpMax,
            atkMax: atkFromTwoAttrs.atkMax,
        };
        const baseStatFromTwoAttrs = {
            hp: hpFromTwoAttrs.hp,
            atk: atkFromTwoAttrs.atk,
            rcv: ([attr1, attr2, rcv100], { monster }) => monster.anyAttributes([attr1, attr2]) ? rcv100 / 100 : 1,
            hpMax: hpFromTwoAttrs.hpMax,
            atkMax: atkFromTwoAttrs.atkMax,
            rcvMax: ([_, _a, rcv100]) => rcv100 / 100,
        };
        // This shouldn't be called.
        const multipleLeaderSkills = { // 116 + 138
        };
        const atkScalingFromLinkedOrbs = {
            atk: ([attrBits, minLinked, atk100base, atk100scale, maxLinked], { comboContainer }) => {
                atk100scale = atk100scale || 0;
                maxLinked = maxLinked || minLinked;
                let linked = 0;
                for (const attr of common_7.idxsFromBits(attrBits)) {
                    for (const combo of comboContainer.combos[common_7.COLORS[attr]]) {
                        linked = combo.count > linked ? combo.count : linked;
                    }
                }
                if (linked < minLinked) {
                    return 1;
                }
                if (linked > maxLinked) {
                    linked = maxLinked;
                }
                return (atk100base + (linked - minLinked) * atk100scale) / 100;
            },
            atkMax: ([_, minLinked, atk100base, atk100scale, maxLinked]) => (atk100base + ((maxLinked || minLinked) - minLinked) * (atk100scale || 0)) / 100,
        };
        const baseStatFromAttrsTypes = {
            hp: ([attrBits, typeBits, hp100], { monster }) => hp100 && (monster.anyAttributes(common_7.idxsFromBits(attrBits)) || monster.anyTypes(common_7.idxsFromBits(typeBits))) ? hp100 / 100 : 1,
            atk: ([attrBits, typeBits, _, atk100], { ping }) => atk100 && (ping.source.anyAttributes(common_7.idxsFromBits(attrBits)) || ping.source.anyTypes(common_7.idxsFromBits(typeBits))) ? atk100 / 100 : 1,
            rcv: ([attrBits, typeBits, _, _a, rcv100], { monster }) => rcv100 && (monster.anyAttributes(common_7.idxsFromBits(attrBits)) || monster.anyTypes(common_7.idxsFromBits(typeBits))) ? rcv100 / 100 : 1,
            hpMax: ([_, _a, hp100]) => (hp100 || 100) / 100,
            atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
            rcvMax: ([_, _a, _b, _c, rcv100]) => (rcv100 || 100) / 100,
        };
        const atkRcvFromAttrTypeSubHp = {
            atk: ([thresh, attrBits, typeBits, atk100], { ping, percentHp }) => {
                if (atk100 && percentHp <= thresh && (ping.source.anyAttributes(common_7.idxsFromBits(attrBits)) || ping.source.anyTypes(common_7.idxsFromBits(typeBits)))) {
                    return atk100 / 100;
                }
                return 1;
            },
            rcvPost: ([thresh, attrBits, typeBits, _, rcv100], { monster, percentHp }) => {
                if (rcv100 && percentHp <= thresh && (monster.anyAttributes(common_7.idxsFromBits(attrBits)) || monster.anyTypes(common_7.idxsFromBits(typeBits)))) {
                    return rcv100 / 100;
                }
                return 1;
            },
            atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
            rcvMax: ([_, _a, _b, _c, rcv100]) => (rcv100 || 100) / 100,
        };
        const atkFromAttrTypeAboveHp = {
            atk: ([thresh, attrBits, typeBits, atk100], { ping, percentHp }) => {
                if (atk100 && percentHp >= thresh && (ping.source.anyAttributes(common_7.idxsFromBits(attrBits)) || ping.source.anyTypes(common_7.idxsFromBits(typeBits)))) {
                    return atk100 / 100;
                }
                return 1;
            },
            atkMax: ([_, _a, _b, atk100]) => atk100 / 100,
        };
        const atkScalingFromMatchedColors2 = {
            atk: ([attr1bit, attr2bit, attr3bit, attr4bit, attr5bit, minMatch, atk100base, atk100scale], { comboContainer }) => {
                atk100scale = atk100scale || 0;
                const maxCounts = {
                    0: 0, 1: 0, 2: 0, 3: 0, 4: 0,
                    5: 0, 6: 0, 7: 0, 8: 0, 9: 9,
                };
                for (const attrBit of [attr1bit, attr2bit, attr3bit, attr4bit, attr5bit].filter((a) => a > 0)) {
                    const attr = common_7.idxsFromBits(attrBit)[0];
                    maxCounts[attr]++;
                }
                let total = 0;
                for (const attr in maxCounts) {
                    total += Math.min(comboContainer.combos[common_7.COLORS[attr]].length, maxCounts[attr]);
                }
                if (total < minMatch) {
                    return 1;
                }
                return ((total - minMatch) * atk100scale + atk100base) / 100;
            },
            atkMax: ([a, b, c, d, e, minMatch, atk100base, atk100scale]) => (([a, b, c, d, e].filter(Boolean).length - minMatch) * (atk100scale || 0) + atk100base) / 100,
        };
        function hasAll(ids, team) {
            return ids
                .filter((id) => id > 0)
                .every((id) => team.some((monster) => monster.id == id));
        }
        const baseStatFromRequiredSubs = {
            hp: ([a, b, c, d, e, hp100], { team }) => hp100 && hasAll([a, b, c, d, e], team) ? hp100 / 100 : 1,
            atk: ([a, b, c, d, e, _, atk100], { team }) => atk100 && hasAll([a, b, c, d, e], team) ? atk100 / 100 : 1,
            rcv: ([a, b, c, d, e, _, _a, rcv100], { team }) => rcv100 && hasAll([a, b, c, d, e], team) ? rcv100 / 100 : 1,
            hpMax: ([_, _a, _b, _c, _d, _e, hp100]) => (hp100 || 100) / 100,
            atkMax: ([_, _a, _b, _c, _d, _e, _f, atk100]) => (atk100 || 100) / 100,
            rcvMax: ([_, _a, _b, _c, _d, _e, _f, _g, rcv100]) => (rcv100 || 100) / 100,
        };
        const baseStatShieldFromAttributeType = {
            hp: ([attrBits, typeBits, hp100], { monster }) => hp100 && monster.anyAttributeTypeBits(attrBits, typeBits) ? hp100 / 100 : 1,
            atk: ([attrBits, typeBits, _, atk100], { ping }) => atk100 && ping.source.anyAttributeTypeBits(attrBits, typeBits) ? atk100 / 100 : 1,
            rcv: ([attrBits, typeBits, _, _a, rcv100], { monster }) => rcv100 && monster.anyAttributeTypeBits(attrBits, typeBits) ? rcv100 / 100 : 1,
            damageMult: ([_, _a, _b, _c, _d, _e, attrBits, shield], { attribute }) => shield && common_7.idxsFromBits(attrBits).some((attr) => attr == attribute) ? 1 - shield / 100 : 1,
            hpMax: ([_, _a, hp100]) => (hp100 || 100) / 100,
            atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
            rcvMax: ([_, _a, _b, _c, rcv100]) => (rcv100 || 100) / 100,
        };
        const atkRcvShieldFromSubHp = {
            atk: ([thresh, attrBits, typeBits, atk100], { percentHp, ping }) => atk100 && percentHp <= thresh && ping.source.anyAttributeTypeBits(attrBits, typeBits) ? atk100 / 100 : 1,
            rcvPost: ([thresh, attrBits, typeBits, _, rcv100], { percentHp, monster }) => rcv100 && percentHp <= thresh && monster.anyAttributeTypeBits(attrBits, typeBits) ? rcv100 / 100 : 1,
            damageMult: ([thresh, _, _a, _b, _c, _d, _e, attrBits, shield100], { percentHp, attribute }) => shield100 && percentHp <= thresh && common_7.idxsFromBits(attrBits).some((attr) => attr == attribute) ? 1 - shield100 / 100 : 1,
            atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
            rcvMax: ([_, _a, _b, _c, rcv100]) => (rcv100 || 100) / 100,
            damageMultMax: ([_, _a, _b, _c, _d, _e, _f, _g, shield100]) => (1 - (shield100 || 100) / 100),
        };
        // Same as above, but with inverted requirement.
        const atkRcvShieldFromAboveHp = {
            atk: ([thresh, ...remaining], context) => context.percentHp >= thresh ? atkRcvShieldFromSubHp.atk([101, ...remaining], context) : 1,
            rcvPost: ([thresh, ...remaining], context) => context.percentHp >= thresh ? atkRcvShieldFromSubHp.rcv([101, ...remaining], context) : 1,
            damageMult: ([thresh, ...remaining], context) => context.percentHp >= thresh ? atkRcvShieldFromSubHp.damageMult([101, ...remaining], context) : 1,
            atkMax: atkRcvShieldFromSubHp.atkMax,
            rcvMax: atkRcvShieldFromSubHp.rcvMax,
            damageMultMax: atkRcvShieldFromSubHp.damageMultMax,
        };
        const atkRcvFromAttrsTypesSkillUse = {
            atk: ([attrBits, typeBits, atk100], { ping, skillUsed }) => atk100 && skillUsed && ping.source.anyAttributeTypeBits(attrBits, typeBits) ? atk100 / 100 : 1,
            rcvPost: ([attrBits, typeBits, _, rcv100], { monster, skillUsed }) => rcv100 && skillUsed && monster.anyAttributeTypeBits(attrBits, typeBits) ? rcv100 / 100 : 1,
            atkMax: ([_, _a, atk100]) => (atk100 || 100) / 100,
            rcvMax: ([_, _a, _b, rcv100]) => (rcv100 || 100) / 100,
        };
        const stackingBaseStatsFromAttrs = {
            hp: ([attr1bit, hp100a, _a, _b, attr2bit, hp100b], { monster }) => {
                return (hp100a && monster.anyAttributeTypeBits(attr1bit, 0) ? hp100a / 100 : 1) * ((hp100b && monster.anyAttributeTypeBits(attr2bit, 0) ? hp100b / 100 : 1));
            },
            atk: ([attr1bit, _a, atk100a, _b, attr2bit, _c, atk100b], { ping }) => {
                return (atk100a && ping.source.anyAttributeTypeBits(attr1bit, 0) ? atk100a / 100 : 1) * ((atk100b && ping.source.anyAttributeTypeBits(attr2bit, 0) ? atk100b / 100 : 1));
            },
            rcv: ([attr1bit, _a, _b, rcv100a, attr2bit, _c, _d, rcv100b], { monster }) => {
                return (rcv100a && monster.anyAttributeTypeBits(attr1bit, 0) ? rcv100a / 100 : 1) * ((rcv100b && monster.anyAttributeTypeBits(attr2bit, 0) ? rcv100b / 100 : 1));
            },
            hpMax: ([_, hp100a, _a, _b, _c, hp100b]) => (hp100a || 100) * (hp100b || 100) / 10000,
            atkMax: ([_, _a, atk100a, _b, _c, _d, atk100b]) => (atk100a || 100) * (atk100b || 100) / 10000,
            rcvMax: ([_, _a, _b, rcv100a, _c, _d, _e, rcv100b]) => (rcv100a || 100) * (rcv100b || 100) / 10000,
        };
        const stackingBaseStatsFromTypes = {
            hp: ([type1bit, hp100a, _a, _b, type2bit, hp100b], { monster }) => {
                return (hp100a && monster.anyAttributeTypeBits(0, type1bit) ? hp100a / 100 : 1) * ((hp100b && monster.anyAttributeTypeBits(0, type2bit) ? hp100b / 100 : 1));
            },
            atk: ([type1bit, _a, atk100a, _b, type2bit, _c, atk100b], { ping }) => {
                return (atk100a && ping.source.anyAttributeTypeBits(0, type1bit) ? atk100a / 100 : 1) * ((atk100b && ping.source.anyAttributeTypeBits(0, type2bit) ? atk100b / 100 : 1));
            },
            rcv: ([type1bit, _a, _b, rcv100a, type2bit, _c, _d, rcv100b], { monster }) => {
                return (rcv100a && monster.anyAttributeTypeBits(0, type1bit) ? rcv100a / 100 : 1) * ((rcv100b && monster.anyAttributeTypeBits(0, type2bit) ? rcv100b / 100 : 1));
            },
            hpMax: ([_, hp100a, _a, _b, _c, hp100b]) => (hp100a || 100) * (hp100b || 100) / 10000,
            atkMax: ([_, _a, atk100a, _b, _c, _d, atk100b]) => (atk100a || 100) * (atk100b || 100) / 10000,
            rcvMax: ([_, _a, _b, rcv100a, _c, _d, _e, rcv100b]) => (rcv100a || 100) * (rcv100b || 100) / 10000,
        };
        // 138 see 116
        const atkFromAttrTypeMultiThresh = {
            atk: ([attrBits, typeBits, threshA, isLesserA, atk100a, threshB, isLesserB, atk100b], { ping, percentHp }) => {
                if (!ping.source.anyAttributeTypeBits(attrBits, typeBits)) {
                    return 1;
                }
                let multiplier = 1;
                if ((isLesserA && percentHp <= threshA) || (!isLesserA && percentHp >= threshA)) {
                    multiplier *= atk100a / 100;
                }
                else if ((isLesserB && percentHp <= threshB) || (!isLesserB && percentHp >= threshB)) {
                    multiplier *= atk100b / 100;
                }
                return multiplier;
            },
            atkMax: ([_, _a, _b, _c, atk100a, _d, _e, _f, atk100b]) => Math.max(atk100a || 0, atk100b || 0) / 100,
        };
        const expBoost = {
            exp: ([exp100]) => exp100 / 100,
        };
        const rcvFromHpa = {
            rcvPost: ([rcv100], { comboContainer }) => comboContainer.combos['h'].some((combo) => combo.count == 4) ? rcv100 / 100 : 1,
            rcvMax: ([rcv100]) => rcv100 / 100,
        };
        const fiveOrbEnhance = {
            atk: ([_unknown, atk100], { ping, comboContainer }) => comboContainer.combos[common_7.COLORS[ping.attribute]].some((combo) => combo.count == 5 && combo.enhanced > 0) ? atk100 / 100 : 1,
            atkMax: ([_, atk100]) => atk100 / 100,
        };
        const atkRcvShieldFromHeartCross = {
            atk: ([atk100], { comboContainer }) => atk100 && comboContainer.combos['h'].some((c) => c.shape == common_7.Shape.CROSS) ? atk100 / 100 : 1,
            rcvPost: ([_, rcv100], { comboContainer }) => rcv100 && comboContainer.combos['h'].some((c) => c.shape == common_7.Shape.CROSS) ? rcv100 / 100 : 1,
            damageMult: ([_, _a, shield], { comboContainer }) => shield && comboContainer.combos['h'].some((c) => c.shape == common_7.Shape.CROSS) ? 1 - shield / 100 : 1,
            atkMax: ([atk100]) => (atk100 || 100) / 100,
            rcvMax: ([_, rcv100]) => (rcv100 || 100) / 100,
            damageMultMax: ([_, _a, shield100]) => (1 - (shield100 || 0) / 100),
        };
        const baseStatFromAttrTypeMultiplayer = {
            hp: (params, context) => context.isMultiplayer ? baseStatFromAttrsTypes.hp(params, context) : 1,
            atk: (params, context) => context.isMultiplayer ? baseStatFromAttrsTypes.atk(params, context) : 1,
            rcv: (params, context) => context.isMultiplayer ? baseStatFromAttrsTypes.rcv(params, context) : 1,
            hpMax: baseStatFromAttrsTypes.hpMax,
            atkMax: baseStatFromAttrsTypes.atkMax,
            rcvMax: baseStatFromAttrsTypes.rcvMax,
        };
        const atkScalingFromCross = {
            atk: (params, { comboContainer }) => {
                let multiplier = 1;
                for (let i = 0; i + 1 < params.length; i += 2) {
                    const count = comboContainer.combos[common_7.COLORS[params[i]]].filter((c) => c.shape == common_7.Shape.CROSS).length;
                    multiplier *= (params[i + 1] / 100) ** count;
                }
                return multiplier;
            },
            // Assume triple cross
            atkMax: ([_a, mult1, _b, mult2, _c, mult3, _d, mult4, _e, mult5]) => (Math.max(mult1 || 0, mult2 || 0, mult3 || 0, mult4 || 0, mult5 || 0) / 100),
        };
        // Same as baseStatFromAttrType, but HP and ATK are swapped with minMatch at
        // the beginning.
        const baseStatFromAttrsTypesMinMatch = {
            minOrbMatch: ([minMatch]) => minMatch,
            hp: ([_, ...p], context) => baseStatFromAttrsTypes.hp([p[0], p[1], p[3], p[2], p[4]], context),
            atk: ([_, ...p], context) => baseStatFromAttrsTypes.atk([p[0], p[1], p[3], p[2], p[4]], context),
            rcv: ([_, ...p], context) => baseStatFromAttrsTypes.rcv([p[0], p[1], p[3], p[2], p[4]], context),
            hpMax: ([_, _a, _b, _c, hp100]) => (hp100 || 100) / 100,
            atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
            rcvMax: ([_, _a, _b, _c, _d, rcv100]) => (rcv100 || 100) / 100,
        };
        const bigBoardLeader = {
            bigBoard: true,
        };
        const baseStatFromAttrsTypesNoSkyfall = {
            noSkyfall: true,
            hp: baseStatFromAttrsTypes.hp,
            atk: baseStatFromAttrsTypes.atk,
            rcv: baseStatFromAttrsTypes.rcv,
            damageMult: baseStatFromAttrsTypes.damageMult,
            hpMax: baseStatFromAttrsTypes.hpMax,
            atkMax: baseStatFromAttrsTypes.atkMax,
            rcvMax: baseStatFromAttrsTypes.rcvMax,
            damageMultMax: baseStatFromAttrsTypes.damageMultMax,
        };
        const atkRcvScalingFromColorMatches = {
            atk: ([a, b, c, d, minMatch, atk100base, _, scale100], { comboContainer }) => {
                if (!atk100base) {
                    return 1;
                }
                scale100 = scale100 || 0;
                const attrs = [a, b, c, d].filter(Boolean).map((bit) => common_7.idxsFromBits(bit)[0]);
                const counts = {};
                for (const attr of attrs) {
                    counts[attr] = (attr in counts) ? counts[attr] + 1 : 1;
                }
                let total = 0;
                for (const attr in counts) {
                    total += Math.max(comboContainer.combos[common_7.COLORS[attr]].length, counts[attr]);
                }
                if (total < minMatch) {
                    return 1;
                }
                return ((total - minMatch) * scale100 + atk100base) / 100;
            },
            rcvPost: ([a, b, c, d, minMatch, _, rcv100base, scale100], { comboContainer }) => {
                if (!rcv100base) {
                    return 1;
                }
                scale100 = scale100 || 0;
                const attrs = [a, b, c, d].filter(Boolean).map((bit) => common_7.idxsFromBits(bit)[0]);
                const counts = {};
                for (const attr of attrs) {
                    counts[attr] = (attr in counts) ? counts[attr] + 1 : 1;
                }
                let total = 0;
                for (const attr in counts) {
                    total += Math.max(comboContainer.combos[common_7.COLORS[attr]].length, counts[attr]);
                }
                if (total < minMatch) {
                    return 1;
                }
                return ((total - minMatch) * scale100 + rcv100base) / 100;
            },
            atkMax: ([a, b, c, d, minMatch, atk100base, _, scale100]) => (([a, b, c, d].filter(Boolean).length - minMatch) * (scale100 || 0) + atk100base) / 100,
            rcvMax: ([a, b, c, d, minMatch, _, rcv100base, scale100]) => (([a, b, c, d].filter(Boolean).length - minMatch) * (scale100 || 0) + rcv100base) / 100,
        };
        const atkRcvScalingFromUniqueColorMatches = {
            atk: ([a, b, c, _, d, _a, e], context) => atkScalingFromUniqueColorMatches.atk([a, b, c, d, e], context),
            rcvPost: ([attrBits, minColors, _, rcv100base, _a, rcv100scale, maxColors], { team, comboContainer }) => {
                maxColors = maxColors || minColors;
                rcv100scale = rcv100scale || 0;
                let count = countMatchedColors(attrBits, comboContainer, team);
                if (count < minColors) {
                    return 1;
                }
                if (count > maxColors) {
                    count = minColors;
                }
                return ((count - minColors) * rcv100scale + rcv100base) / 100;
            },
            atkMax: ([attrBits, minColors, atk100base, _, atk100scale, _a, moreColors]) => atkScalingFromUniqueColorMatches.atkMax([attrBits, minColors, atk100base, atk100scale, moreColors]),
            rcvMax: ([attrBits, minColors, _, rcv100base, _a, rcv100scale, moreColors]) => atkScalingFromUniqueColorMatches.atkMax([attrBits, minColors, rcv100base, rcv100scale, moreColors]),
        };
        const atkRcvScalingFromCombos = {
            atk: ([minCombo, atk100base, _, atk100scale, _a, maxCombo], { comboContainer }) => {
                atk100scale = atk100scale || 0;
                maxCombo = maxCombo || minCombo;
                let count = comboContainer.comboCount();
                if (count < minCombo) {
                    return 1;
                }
                if (count > maxCombo) {
                    count = maxCombo;
                }
                return ((count - minCombo) * atk100scale + atk100base) / 100;
            },
            rcvPost: ([minCombo, _, rcv100base, _a, rcv100scale, maxCombo], { comboContainer }) => {
                rcv100scale = rcv100scale || 0;
                maxCombo = maxCombo || minCombo;
                let count = comboContainer.comboCount();
                if (count < minCombo) {
                    return 1;
                }
                if (count > maxCombo) {
                    count = maxCombo;
                }
                return ((count - minCombo) * rcv100scale + rcv100base) / 100;
            },
            atkMax: ([minCombo, atk100base, _, atk100scale, _a, maxCombo]) => (((maxCombo || minCombo) - minCombo) * (atk100scale || 0) + atk100base) / 100,
            rcvMax: ([minCombo, _, rcv100base, _a, rcv100scale, maxCombo]) => (((maxCombo || minCombo) - minCombo) * (rcv100scale || 0) + rcv100base) / 100,
        };
        const atkRcvScalingFromLinkedOrbs = {
            atk: ([attrBits, minLinked, atk100base, _, atk100scale, _a, maxLinked], { comboContainer }) => {
                if (!atk100base) {
                    return 1;
                }
                atk100scale = atk100scale || 0;
                maxLinked = maxLinked || minLinked;
                let highest = 0;
                for (const attr of common_7.idxsFromBits(attrBits)) {
                    for (const c of comboContainer.combos[common_7.COLORS[attr]]) {
                        if (c.count > highest) {
                            highest = c.count;
                        }
                    }
                }
                if (highest < minLinked) {
                    return 1;
                }
                if (highest > maxLinked) {
                    highest = maxLinked;
                }
                return ((highest - minLinked) * atk100scale + atk100base) / 100;
            },
            rcvPost: ([attrBits, minLinked, _, rcv100base, _a, rcv100scale, maxLinked], { comboContainer }) => {
                if (!rcv100base) {
                    return 1;
                }
                rcv100scale = rcv100scale || 0;
                maxLinked = maxLinked || minLinked;
                let highest = 0;
                for (const attr of common_7.idxsFromBits(attrBits)) {
                    for (const c of comboContainer.combos[common_7.COLORS[attr]]) {
                        if (c.count > highest) {
                            highest = c.count;
                        }
                    }
                }
                if (highest < minLinked) {
                    return 1;
                }
                if (highest > maxLinked) {
                    highest = maxLinked;
                }
                return ((highest - minLinked) * rcv100scale + rcv100base) / 100;
            },
            atkMax: ([_, minLinked, atk100base, _a, atk100scale, _b, maxLinked]) => (((maxLinked || minLinked) - minLinked) * (atk100scale || 0) + atk100base) / 100,
            rcvMax: ([_, minLinked, _a, rcv100base, _b, rcv100scale, maxLinked]) => (((maxLinked || minLinked) - minLinked) * (rcv100scale || 0) + rcv100base) / 100,
        };
        const atkShieldFromCombos = {
            atk: ([minCombos, atk100], { comboContainer }) => atk100 && comboContainer.comboCount() >= minCombos ? atk100 / 100 : 1,
            damageMult: ([minCombos, _, shield], { comboContainer }) => shield && comboContainer.comboCount() >= minCombos ? 1 - shield / 100 : 1,
            atkMax: ([_, atk100]) => (atk100 || 100) / 100,
            damageMultMax: ([_, _a, shield100]) => 1 - (shield100 || 0) / 100,
        };
        const atkShieldFromColorMatches = {
            atk: ([attrBits, minMatch, atk100], { comboContainer, team }) => atk100 && countMatchedColors(attrBits, comboContainer, team) >= minMatch ? atk100 / 100 : 1,
            damageMult: ([attrBits, minMatch, _, shield], { comboContainer, team }) => shield && countMatchedColors(attrBits, comboContainer, team) >= minMatch ? 1 - shield / 100 : 1,
            atkMax: (p) => (p[2] || 100) / 100,
            damageMultMax: (p) => 1 - (p[3] || 0) / 100,
        };
        function countColorMatches(cbits, comboContainer) {
            const counts = {};
            for (const attr of cbits.filter(Boolean).map((v) => common_7.idxsFromBits(v)[0])) {
                counts[attr] = counts[attr] ? counts[attr] + 1 : 1;
            }
            let total = 0;
            for (const attr in counts) {
                total += Math.min(counts[attr], comboContainer.combos[common_7.COLORS[attr]].length);
            }
            return total;
        }
        const atkShieldFromColorMatches2 = {
            atk: ([a, b, c, d, minMatch, atk100], { comboContainer }) => atk100 && countColorMatches([a, b, c, d], comboContainer) >= minMatch ? atk100 / 100 : 1,
            damageMult: ([a, b, c, d, minMatch, _, shield100], { comboContainer }) => shield100 && countColorMatches([a, b, c, d], comboContainer) >= minMatch ? (1 - shield100 / 100) : 1,
            atkMax: (p) => (p[5] || 100) / 100,
            damageMultMax: (p) => 1 - (p[6] || 0) / 100,
        };
        const baseStatFromCollab = {
            hp: ([c1, c2, c3, hp100], { team }) => hp100 && subs(team).every((sub) => [c1, c2, c3].filter(Boolean).some((c) => c == sub.getCard().collab)) ? hp100 / 100 : 1,
            atk: ([c1, c2, c3, _, atk100], { team }) => atk100 && subs(team).every((sub) => [c1, c2, c3].filter(Boolean).some((c) => c == sub.getCard().collab)) ? atk100 / 100 : 1,
            rcv: ([c1, c2, c3, _, _a, rcv100], { team }) => rcv100 && subs(team).every((sub) => [c1, c2, c3].filter(Boolean).some((c) => c == sub.getCard().collab)) ? rcv100 / 100 : 1,
            hpMax: (p) => (p[3] || 100) / 100,
            atkMax: (p) => (p[4] || 100) / 100,
            rcvMax: (p) => (p[5] || 100) / 100,
        };
        const atkScalingFromOrbsRemaining = {
            atk: ([a, b, c, d, e, maxRemaining, atk100base, atk100scale], { comboContainer }) => {
                atk100scale = atk100scale || 0;
                const unknowns = [a, b, c, d, e].filter(Boolean);
                if (unknowns.length) {
                    console.warn(`Unhandled parameters from atkScalingFromOrbsRemaining: ${[a, b, c, d, e]}`);
                }
                const remaining = comboContainer.getRemainingOrbs();
                if (remaining > maxRemaining) {
                    return 1;
                }
                return ((maxRemaining - remaining) * (atk100scale || 0) + atk100base) / 100;
            },
            atkMax: (p) => (p[5] * (p[7] || 0) + p[6]) / 100,
        };
        const baseStatFromAttrsTypesFixedTime = {
            fixedTime: ([fixedSeconds]) => fixedSeconds,
            hp: ([_, ...params], context) => baseStatFromAttrsTypes.hp(params, context),
            atk: ([_, ...params], context) => baseStatFromAttrsTypes.atk(params, context),
            rcv: ([_, ...params], context) => baseStatFromAttrsTypes.rcv(params, context),
            hpMax: (p) => (p[3] || 100) / 100,
            atkMax: (p) => (p[4] || 100) / 100,
            rcvMax: (p) => (p[5] || 100) / 100,
        };
        const atkShieldFromLinkedOrbs = {
            atk: ([attrBits, minMatched, atk100], { comboContainer }) => {
                if (!atk100) {
                    return 1;
                }
                let highest = 0;
                for (const attr of common_7.idxsFromBits(attrBits)) {
                    for (const c of comboContainer.combos[common_7.COLORS[attr]]) {
                        highest = c.count > highest ? c.count : highest;
                    }
                }
                return highest >= minMatched ? atk100 / 100 : 1;
            },
            damageMult: ([attrBits, minMatched, _, shield], { comboContainer }) => {
                if (!shield) {
                    return 1;
                }
                let highest = 0;
                for (const attr of common_7.idxsFromBits(attrBits)) {
                    for (const c of comboContainer.combos[common_7.COLORS[attr]]) {
                        highest = c.count > highest ? c.count : highest;
                    }
                }
                return highest >= minMatched ? shield / 100 : 1;
            },
            atkMax: (p) => (p[2] || 100) / 100,
            damageMultMax: (p) => 1 - (p[3] || 0) / 100,
        };
        const atkRcvShieldFromMultThresh = {
            atk: ([attrBits, typeBits, minThresh, aboveAtk100, _, maxThresh, belowAtk100], { ping, percentHp }) => {
                if (!ping.source.anyAttributeTypeBits(attrBits, typeBits) || (!aboveAtk100 && !belowAtk100)) {
                    return 1;
                }
                maxThresh = maxThresh || 0;
                belowAtk100 = belowAtk100 || 100;
                aboveAtk100 = aboveAtk100 || 100;
                let multiplier = 1;
                if (percentHp >= minThresh) {
                    multiplier *= aboveAtk100 / 100;
                }
                if (percentHp <= maxThresh) {
                    multiplier *= belowAtk100 / 100;
                }
                return multiplier;
            },
            rcvPost: ([attrBits, typeBits, _, _a, _b, maxThresh, _c, belowRcv100], { monster, percentHp }) => {
                if (!maxThresh || !belowRcv100 || !monster.anyAttributeTypeBits(attrBits, typeBits)) {
                    return 1;
                }
                return percentHp <= maxThresh ? belowRcv100 / 100 : 1;
            },
            damageMult: ([_, _a, minThresh, _b, shield], { percentHp }) => {
                return shield && percentHp <= minThresh ? 1 - shield / 100 : 1;
            },
            atkMax: (p) => Math.max(p[3] || 100, p[6] || 100) / 100,
            rcvMax: (p) => (p[7] || 100) / 100,
            damageMultMax: (p) => 1 - (p[4] || 0) / 100,
        };
        const baseStatFromAttrsTypesTimeExtend = {
            timeExtend: ([sec100]) => sec100 / 100,
            hp: ([_, ...params], context) => baseStatFromAttrsTypes.hp(params, context),
            atk: ([_, ...params], context) => baseStatFromAttrsTypes.atk(params, context),
            rcv: ([_, ...params], context) => baseStatFromAttrsTypes.rcv(params, context),
            hpMax: (p) => (p[3] || 100) / 100,
            atkMax: (p) => (p[4] || 100) / 100,
            rcvMax: (p) => (p[5] || 100) / 100,
        };
        const baseStatFromAttrsTypesBigBoard = {
            bigBoard: true,
            hp: baseStatFromAttrsTypes.hp,
            atk: baseStatFromAttrsTypes.atk,
            rcv: baseStatFromAttrsTypes.rcv,
            hpMax: baseStatFromAttrsTypes.hpMax,
            atkMax: baseStatFromAttrsTypes.atkMax,
            rcvMax: baseStatFromAttrsTypes.rcvMax,
        };
        const atkPlusCombosFromAllLinkedOrbs = {
            atk: ([attrBits, minLinked, atk100], { comboContainer }) => {
                if (!atk100) {
                    return 1;
                }
                return common_7.idxsFromBits(attrBits)
                    .every((attr) => comboContainer.combos[common_7.COLORS[attr]]
                    .some((c) => c.count >= minLinked)) ? atk100 / 100 : 1;
            },
            plusCombo: ([attrBits, minLinked, _, comboBonus], { comboContainer }) => {
                if (!comboBonus) {
                    return 0;
                }
                return common_7.idxsFromBits(attrBits)
                    .every((attr) => comboContainer.combos[common_7.COLORS[attr]]
                    .some((c) => c.count >= minLinked)) ? comboBonus : 0;
            },
            atkMax: (p) => (p[2] || 100) / 100,
            plusComboMax: (p) => p[3] || 0,
        };
        const atkRcvShieldFromLMatch = {
            atk: ([attrBits, atk100], { comboContainer }) => atk100 && common_7.idxsFromBits(attrBits).some((attr) => comboContainer.combos[common_7.COLORS[attr]].some((c) => c.shape == common_7.Shape.L)) ? atk100 / 100 : 1,
            rcvPost: ([attrBits, _, rcv100], { comboContainer }) => rcv100 && common_7.idxsFromBits(attrBits).some((attr) => comboContainer.combos[common_7.COLORS[attr]].some((c) => c.shape == common_7.Shape.L)) ? rcv100 / 100 : 1,
            damageMult: ([attrBits, _, _a, shield], { comboContainer }) => shield && common_7.idxsFromBits(attrBits).some((attr) => comboContainer.combos[common_7.COLORS[attr]].some((c) => c.shape == common_7.Shape.L)) ? 1 - shield / 100 : 1,
            atkMax: (p) => (p[1] || 100) / 100,
            rcvMax: (p) => (p[2] || 100) / 100,
            damageMultMax: (p) => 1 - (p[3] || 0) / 100,
        };
        const atkPlusCombosFromRainbow = {
            atk: ([attrBits, minColors, atk100], { comboContainer, team }) => atk100 && countMatchedColors(attrBits, comboContainer, team) >= minColors ? atk100 / 100 : 1,
            plusCombo: ([attrBits, minColors, _, comboBonus], { comboContainer, team }) => comboBonus && countMatchedColors(attrBits, comboContainer, team) >= minColors ? comboBonus : 0,
            atkMax: (p) => (p[2] || 100) / 100,
            plusComboMax: (p) => p[3] || 0,
        };
        const disablePoisonDamage = {
            ignorePoison: true,
        };
        const atkShieldAwokenClearFromHealing = {
            atk: ([thresh, atk100], { healing }) => atk100 && healing >= thresh ? atk100 / 100 : 1,
            damageMult: ([thresh, _, damageMult], { healing }) => damageMult && healing >= thresh ? damageMult / 100 : 1,
            awokenBindClear: ([thresh, _, _a, awokenBindClear], { healing }) => awokenBindClear && healing >= thresh ? awokenBindClear : 0,
            atkMax: (p) => (p[1] || 100) / 100,
            damageMultMax: (p) => 1 - (p[2] || 0) / 100,
            awokenBindClearMax: (p) => p[3] || 0,
        };
        const trueBonusFromRainbowMatches = {
            trueBonusAttack: ([attrBits, minMatch, trueDamage], { team, comboContainer }) => countMatchedColors(attrBits, comboContainer, team) >= minMatch ? trueDamage : 0,
            trueBonusAttackMax: (p) => p[2],
        };
        const trueBonusFromLinkedOrbs = {
            trueBonusAttack: ([attrBits, minLinked, trueDamage], { comboContainer }) => {
                return common_7.idxsFromBits(attrBits)
                    .some((attr) => comboContainer.combos[common_7.COLORS[attr]]
                    .some((c) => c.count >= minLinked)) ? trueDamage : 0;
            },
            trueBonusAttackMax: (p) => p[2],
        };
        const trueBonusFromColorMatches = {
            trueBonusAttack: ([c1, c2, c3, c4, minColors, trueDamage], { comboContainer }) => countColorMatches([c1, c2, c3, c4], comboContainer) >= minColors ? trueDamage : 0,
            trueBonusAttackMax: (p) => p[5],
        };
        const GROUP_CHECK = {
            0: (m) => m.getCard().evoMaterials.includes(3826),
            2: (m) => Boolean(m.getCard().inheritanceType & 32),
        };
        function checkSubsMatchGroup(groupId, team) {
            const groupCheck = GROUP_CHECK[groupId];
            if (!groupCheck) {
                console.error(`Unhandled Group ID: ${groupId}`);
                return false;
            }
            return subs(team).every(groupCheck);
        }
        const baseStatFromGroup = {
            hp: ([groupId, hpMult100], { team }) => hpMult100 && checkSubsMatchGroup(groupId, team) ? hpMult100 / 100 : 1,
            atk: ([groupId, _, atkMult100], { team }) => atkMult100 && checkSubsMatchGroup(groupId, team) ? atkMult100 / 100 : 1,
            rcv: ([groupId, _, _a, rcvMult100], { team }) => rcvMult100 && checkSubsMatchGroup(groupId, team) ? rcvMult100 / 100 : 1,
            hpMax: (p) => (p[1] || 100) / 100,
            atkMax: (p) => (p[2] || 100) / 100,
            rcvMax: (p) => (p[3] || 100) / 100,
        };
        const plusComboFromColorMatches = {
            plusCombo: ([a, b, c, d, e, minMatch, bonusCombo], { comboContainer }) => countColorMatches([a, b, c, d, e], comboContainer) >= minMatch ? bonusCombo : 0,
            plusComboMax: (p) => p[6],
        };
        const LEADER_SKILL_GENERATORS = {
            0: {},
            11: atkFromAttr,
            12: bonusAttackScale,
            13: autoHealLead,
            14: resolveLead,
            15: pureTimeExtend,
            16: shieldAgainstAll,
            17: shieldAgainstAttr,
            22: atkFromType,
            23: hpFromType,
            24: rcvFromType,
            26: atkUnconditional,
            28: atkRcvFromAttr,
            29: baseStatFromAttr,
            30: hpFromTwoTypes,
            31: atkFromTwoTypes,
            33: drumSounds,
            36: shieldAgainstTwoAttr,
            38: shieldFromHp,
            39: atkRcvFromSubHp,
            40: atkFromTwoAttrs,
            41: counterattack,
            43: shieldFromAboveHp,
            44: atkRcvFromAboveHp,
            45: atkRcvFromAttr,
            46: hpFromTwoAttrs,
            48: hpFromAttr,
            49: rcvFromAttr,
            53: dropBoost,
            54: coinBoost,
            61: atkScalingFromUniqueColorMatches,
            62: atkHpFromType,
            63: hpRcvFromType,
            64: atkRcvFromType,
            65: baseStatFromType,
            66: atkFromCombos,
            67: hpRcvFromAttr,
            69: atkFromAttrType,
            73: atkHpFromAttrType,
            75: atkRcvFromAttrType,
            76: baseStatFromAttrType,
            77: atkFromTwoTypes,
            79: atkRcvFromTwoTypes,
            94: atkRcvFromAttrAndSubHp,
            95: atkRcvFromTypeAndSubHp,
            96: atkRcvFromAttrAndAboveHp,
            97: atkRcvFromTypeAndAboveHp,
            98: atkScalingFromCombos,
            100: atkRcvFromSkill,
            101: atkFromExactCombos,
            103: atkRcvFromCombos,
            104: atkRcvFromAttrCombos,
            105: atkFromDecreasedRcv,
            106: atkFromDecreasedHp,
            107: hpDecrease,
            108: atkFromTypeDecreasedHp,
            109: atkFromLinkedOrbs,
            111: atkHpFromTwoAttrs,
            114: baseStatFromTwoAttrs,
            119: atkScalingFromLinkedOrbs,
            121: baseStatFromAttrsTypes,
            122: atkRcvFromAttrTypeSubHp,
            123: atkFromAttrTypeAboveHp,
            124: atkScalingFromMatchedColors2,
            125: baseStatFromRequiredSubs,
            129: baseStatShieldFromAttributeType,
            130: atkRcvShieldFromSubHp,
            131: atkRcvShieldFromAboveHp,
            133: atkRcvFromAttrsTypesSkillUse,
            136: stackingBaseStatsFromAttrs,
            137: stackingBaseStatsFromTypes,
            138: multipleLeaderSkills,
            139: atkFromAttrTypeMultiThresh,
            148: expBoost,
            149: rcvFromHpa,
            150: fiveOrbEnhance,
            151: atkRcvShieldFromHeartCross,
            155: baseStatFromAttrTypeMultiplayer,
            157: atkScalingFromCross,
            158: baseStatFromAttrsTypesMinMatch,
            159: atkScalingFromLinkedOrbs,
            162: bigBoardLeader,
            163: baseStatFromAttrsTypesNoSkyfall,
            164: atkRcvScalingFromColorMatches,
            165: atkRcvScalingFromUniqueColorMatches,
            166: atkRcvScalingFromCombos,
            167: atkRcvScalingFromLinkedOrbs,
            169: atkShieldFromCombos,
            170: atkShieldFromColorMatches,
            171: atkShieldFromColorMatches2,
            175: baseStatFromCollab,
            177: atkScalingFromOrbsRemaining,
            178: baseStatFromAttrsTypesFixedTime,
            182: atkShieldFromLinkedOrbs,
            183: atkRcvShieldFromMultThresh,
            185: baseStatFromAttrsTypesTimeExtend,
            186: baseStatFromAttrsTypesBigBoard,
            192: atkPlusCombosFromAllLinkedOrbs,
            193: atkRcvShieldFromLMatch,
            194: atkPlusCombosFromRainbow,
            197: disablePoisonDamage,
            198: atkShieldAwokenClearFromHealing,
            199: trueBonusFromRainbowMatches,
            200: trueBonusFromLinkedOrbs,
            201: trueBonusFromColorMatches,
            203: baseStatFromGroup,
            206: plusComboFromColorMatches,
        };
        // Functions for libraries to call directly.
        function bigBoard(id) {
            const playerSkill = ilmina_stripped_4.floof.getPlayerSkill(id);
            // Handle multiple leader skills.
            if (playerSkill.internalEffectId == 138) {
                return playerSkill.internalEffectArguments.some((i) => bigBoard(i));
            }
            return LEADER_SKILL_GENERATORS[playerSkill.internalEffectId].bigBoard || false;
        }
        exports.bigBoard = bigBoard;
        function noSkyfall(id) {
            const playerSkill = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (playerSkill.internalEffectId == 138) {
                return playerSkill.internalEffectArguments.some((i) => noSkyfall(i));
            }
            return LEADER_SKILL_GENERATORS[playerSkill.internalEffectId].noSkyfall || false;
        }
        exports.noSkyfall = noSkyfall;
        function ignorePoison(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            // Handle multiple leader skills.
            if (internalEffectId == 138) {
                return internalEffectArguments.some((i) => ignorePoison(i));
            }
            return LEADER_SKILL_GENERATORS[internalEffectId].ignorePoison || false;
        }
        exports.ignorePoison = ignorePoison;
        function drumEffect(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            // Handle multiple leader skills.
            if (internalEffectId == 138) {
                return internalEffectArguments.some((i) => drumEffect(i));
            }
            return LEADER_SKILL_GENERATORS[internalEffectId].drumEffect || false;
        }
        exports.drumEffect = drumEffect;
        function minOrbMatch(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return Math.max(...internalEffectArguments.map((i) => minOrbMatch(i)));
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].minOrbMatch || (() => 3))(internalEffectArguments);
        }
        exports.minOrbMatch = minOrbMatch;
        function resolve(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return Math.min(...internalEffectArguments.map((i) => resolve(i)));
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].resolve || (() => 101))(internalEffectArguments);
        }
        exports.resolve = resolve;
        function fixedTime(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                const times = internalEffectArguments.map((i) => fixedTime(i)).filter((t) => t > 0);
                return times.length ? Math.min(...times) : 0;
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].fixedTime || (() => 0))(internalEffectArguments);
        }
        exports.fixedTime = fixedTime;
        function timeExtend(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => timeExtend(i)).reduce((total, value) => total + value);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].timeExtend || (() => 0))(internalEffectArguments);
        }
        exports.timeExtend = timeExtend;
        function hp(id, context = undefined) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => hp(i, context)).reduce((total, value) => total * value);
            }
            if (context) {
                return (LEADER_SKILL_GENERATORS[internalEffectId].hp || (() => 1))(internalEffectArguments, context);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].hpMax || (() => 1))(internalEffectArguments);
        }
        exports.hp = hp;
        function atk(id, context = undefined) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                // Stupid handling of multiple cross leads.
                if (!context) {
                    let remainingCrosses = 3;
                    let multiplier = 1;
                    for (const arg of internalEffectArguments) {
                        const skill = ilmina_stripped_4.floof.getPlayerSkill(arg);
                        // Heart Cross uses one cross.
                        if (skill.internalEffectId == 151) {
                            if (!remainingCrosses) {
                                continue;
                            }
                            remainingCrosses--;
                        }
                        // Normal Cross scaling all remaining.
                        if (ilmina_stripped_4.floof.getPlayerSkill(arg).internalEffectId == 157) {
                            if (remainingCrosses) {
                                multiplier *= atkScalingFromCross.atkMax(skill.internalEffectArguments) ** remainingCrosses;
                                remainingCrosses = 0;
                            }
                            continue;
                        }
                        multiplier *= (LEADER_SKILL_GENERATORS[skill.internalEffectId].atkMax || (() => 1))(skill.internalEffectArguments);
                    }
                    return multiplier;
                }
                return internalEffectArguments.map((i) => atk(i, context)).reduce((total, value) => total * value);
            }
            if (context) {
                return (LEADER_SKILL_GENERATORS[internalEffectId].atk || (() => 1))(internalEffectArguments, context);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].atkMax || (() => 1))(internalEffectArguments);
        }
        exports.atk = atk;
        function rcv(id, context = undefined) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => rcv(i, context)).reduce((total, value) => total * value);
            }
            if (context) {
                return (LEADER_SKILL_GENERATORS[internalEffectId].rcv || (() => 1))(internalEffectArguments, context);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].rcvMax || (() => 1))(internalEffectArguments);
        }
        exports.rcv = rcv;
        function rcvPost(id, context) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => rcvPost(i, context)).reduce((total, value) => total * value);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].rcvPost || (() => 1))(internalEffectArguments, context);
        }
        exports.rcvPost = rcvPost;
        function damageMult(id, context = undefined) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => damageMult(i, context)).reduce((total, value) => total * value);
            }
            if (context) {
                return (LEADER_SKILL_GENERATORS[internalEffectId].damageMult || (() => 1))(internalEffectArguments, context);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].damageMultMax || (() => 1))(internalEffectArguments);
        }
        exports.damageMult = damageMult;
        function plusCombo(id, context = undefined) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => plusCombo(i, context)).reduce((total, value) => total + value, 0);
            }
            if (context) {
                return (LEADER_SKILL_GENERATORS[internalEffectId].plusCombo || (() => 0))(internalEffectArguments, context);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].plusComboMax || (() => 0))(internalEffectArguments);
        }
        exports.plusCombo = plusCombo;
        function drop(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => drop(i)).reduce((total, value) => total * value);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].drop || (() => 1))(internalEffectArguments);
        }
        exports.drop = drop;
        function coins(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => coins(i)).reduce((total, value) => total * value);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].coins || (() => 1))(internalEffectArguments);
        }
        exports.coins = coins;
        function exp(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => exp(i)).reduce((total, value) => total * value);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].exp || (() => 1))(internalEffectArguments);
        }
        exports.exp = exp;
        function autoHeal(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => autoHeal(i)).reduce((total, value) => total + value);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].autoHeal || (() => 0))(internalEffectArguments);
        }
        exports.autoHeal = autoHeal;
        function trueBonusAttack(id, context = undefined) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => trueBonusAttack(i, context)).reduce((total, value) => total + value);
            }
            if (context) {
                return (LEADER_SKILL_GENERATORS[internalEffectId].trueBonusAttack || (() => 0))(internalEffectArguments, context);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].trueBonusAttackMax || (() => 0))(internalEffectArguments);
        }
        exports.trueBonusAttack = trueBonusAttack;
        function bonusAttack(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => bonusAttack(i)).reduce((total, value) => total + value);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].bonusAttack || (() => 0))(internalEffectArguments);
        }
        exports.bonusAttack = bonusAttack;
        function counter(id) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments
                    .map((i) => counter(i))
                    .reduce((aggregate, next) => ({
                    multiplier: aggregate.multiplier + next.multiplier,
                    attribute: Math.max(aggregate.attribute, next.attribute)
                }));
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].counter || (() => ({ multiplier: 0, attribute: -1 })))(internalEffectArguments);
        }
        exports.counter = counter;
        function awokenBindClear(id, context = undefined) {
            const { internalEffectId, internalEffectArguments } = ilmina_stripped_4.floof.getPlayerSkill(id);
            if (internalEffectId == 138) {
                return internalEffectArguments.map((i) => awokenBindClear(i, context)).reduce((total, value) => total + value);
            }
            if (context) {
                return (LEADER_SKILL_GENERATORS[internalEffectId].awokenBindClear || (() => 0))(internalEffectArguments, context);
            }
            return (LEADER_SKILL_GENERATORS[internalEffectId].awokenBindClearMax || (() => 0))(internalEffectArguments);
        }
        exports.awokenBindClear = awokenBindClear;
    });
    define("player_team", ["require", "exports", "common", "monster_instance", "damage_ping", "templates", "ilmina_stripped", "leaders", "debugger", "team_conformance", "templates"], function (require, exports, common_8, monster_instance_1, damage_ping_1, templates_4, ilmina_stripped_5, leaders, debugger_2, team_conformance_1, templates_5) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        leaders = __importStar(leaders);
        const DEFAULT_STATE = {
            awakenings: true,
            currentHp: -1,
            skills: true,
            skillUsed: true,
            shieldPercent: 0,
            attributesShielded: [],
            burst: {
                attrRestrictions: [],
                typeRestrictions: [],
                awakenings: [],
                multiplier: 1,
                awakeningScale: 0,
            },
            voidDamageAbsorb: false,
            voidAttributeAbsorb: false,
            voidDamageVoid: false,
            timeBonus: 0,
            timeIsMult: false,
            rcvMult: 1,
            fixedHp: 0,
            leadSwaps: [0, 0, 0],
            bigBoard: false,
        };
        const DEFAULT_BURST = {
            attrRestrictions: [],
            typeRestrictions: [],
            awakenings: [],
            multiplier: 1,
            awakeningScale: 0,
        };
        function teamJsonEqual(a, b) {
            if (a.title != b.title) {
                return false;
            }
            if (String(a.badges) != String(b.badges)) {
                return false;
            }
            if (a.description != b.description) {
                return false;
            }
            if (a.playerMode != b.playerMode) {
                return false;
            }
            if (a.tests != b.tests) {
                return false;
            }
            if (a.monsters.length != b.monsters.length) {
                return false;
            }
            for (let i = 0; i < a.monsters.length; i++) {
                if (!monster_instance_1.monsterJsonEqual(a.monsters[i], b.monsters[i])) {
                    return false;
                }
            }
            return true;
        }
        class StoredTeams {
            constructor(team) {
                this.teams = {};
                if (window.localStorage.idcStoredTeams) {
                    try {
                        this.teams = JSON.parse(ilmina_stripped_5.decompress(window.localStorage.idcStoredTeams));
                    }
                    catch (e) {
                        this.teams = JSON.parse(window.localStorage.idcStoredTeams);
                        window.localStorage.idcStoredTeams = ilmina_stripped_5.compress(window.localStorage.idcStoredTeams);
                    }
                }
                this.display = new templates_4.StoredTeamDisplay(
                // On Save Click
                () => {
                    this.saveTeam(team.toJson());
                    this.update();
                }, 
                // On Load Click
                (name) => {
                    if (team.hasChange() &&
                        (!templates_5.SETTINGS.getBool(common_8.BoolSetting.WARN_CHANGE)
                            || window.confirm('Changes made to current team, load anyways?'))) {
                        team.fromJson(this.getTeam(name));
                        team.openTeamTab();
                    }
                }, 
                // On Delete Click
                (name) => {
                    this.deleteTeam(name);
                    this.update();
                });
                this.update();
            }
            getElement() {
                return this.display.getElement();
            }
            update() {
                this.display.update(Object.keys(this.teams));
            }
            getTeam(name) {
                if (!(name in this.teams)) {
                    throw 'Invalid team name.';
                }
                return this.teams[name];
            }
            // TODO: Add confirmation if overriding.
            saveTeam(teamJson) {
                this.teams[teamJson.title] = teamJson;
                window.localStorage.idcStoredTeams = ilmina_stripped_5.compress(JSON.stringify(this.teams));
            }
            // TODO: Add confirmation.
            deleteTeam(title) {
                delete this.teams[title];
                window.localStorage.idcStoredTeams = ilmina_stripped_5.compress(JSON.stringify(this.teams));
            }
        }
        const SHARED_AWAKENINGS = new Set([
            common_8.Awakening.SKILL_BOOST,
            common_8.Awakening.SKILL_BOOST_PLUS,
            common_8.Awakening.RESIST_POISON,
            common_8.Awakening.RESIST_POISON_PLUS,
            common_8.Awakening.RESIST_BLIND,
            common_8.Awakening.RESIST_BLIND_PLUS,
            common_8.Awakening.RESIST_JAMMER,
            common_8.Awakening.RESIST_JAMMER_PLUS,
            common_8.Awakening.SBR,
            common_8.Awakening.RESIST_CLOUD,
            common_8.Awakening.RESIST_TAPE,
        ]);
        class Team {
            constructor() {
                this.teamName = '';
                this.description = '';
                this.tests = '';
                this.monsters = [];
                this.playerMode = 1;
                this.activeTeamIdx = 0;
                this.activeMonster = 0;
                this.lastMaxHp = 0;
                this.action = -1;
                this.state = Object.assign({}, DEFAULT_STATE);
                this.badges = [common_8.TeamBadge.NONE, common_8.TeamBadge.NONE, common_8.TeamBadge.NONE];
                this.onSelectMonster = () => { };
                /**
                 * 1P: 0-5
                 * 2P: 0-4, 6-10
                 * 3P: 0-5, 6-11, 12-17
                 */
                for (let i = 0; i < 18; i++) {
                    this.monsters.push(new monster_instance_1.MonsterInstance(-1, (ctx) => {
                        if (ctx.transformActive != undefined) {
                            const idxToTransform = this.getMonsterIdx(Math.floor(i / 6), i % 6);
                            const monster = this.monsters[idxToTransform];
                            if (monster.getCard().transformsTo > 0) {
                                monster.transformedTo = monster.getCard().transformsTo;
                            }
                            else if (!ctx.transformActive) {
                                monster.transformedTo = -1;
                            }
                        }
                        this.update();
                    }));
                }
                this.storage = new StoredTeams(this);
                this.teamPane = new templates_4.TeamPane(this.storage.getElement(), this.monsters.map((monster) => monster.getElement()), (ctx) => {
                    if (ctx.title) {
                        this.teamName = ctx.title;
                    }
                    if (ctx.teamIdx != undefined) {
                        this.setActiveTeamIdx(ctx.teamIdx);
                    }
                    if (ctx.monsterIdx != undefined) {
                        this.setActiveMonsterIdx(ctx.monsterIdx);
                    }
                    if (ctx.description != undefined) {
                        this.description = ctx.description;
                    }
                    if (ctx.tests != undefined) {
                        this.tests = ctx.tests;
                    }
                    if (ctx.currentHp != undefined) {
                        if (ctx.currentHp < 0) {
                            this.state.currentHp = 0;
                        }
                        else if (ctx.currentHp > this.getHp()) {
                            this.state.currentHp = this.getHp();
                        }
                        else {
                            this.state.currentHp = ctx.currentHp;
                        }
                    }
                    if (ctx.fixedHp != undefined) {
                        this.state.fixedHp = ctx.fixedHp;
                    }
                    if (ctx.action != undefined) {
                        this.action = ctx.action;
                    }
                    if (ctx.leadSwap != undefined) {
                        this.updateState({ leadSwap: ctx.leadSwap });
                    }
                    if (ctx.voidDamageAbsorb != undefined) {
                        this.state.voidDamageAbsorb = ctx.voidDamageAbsorb;
                    }
                    if (ctx.voidAttributeAbsorb != undefined) {
                        this.state.voidAttributeAbsorb = ctx.voidAttributeAbsorb;
                    }
                    if (ctx.voidDamageVoid != undefined) {
                        this.state.voidDamageVoid = ctx.voidDamageVoid;
                    }
                    if (ctx.voidAwakenings != undefined) {
                        this.state.awakenings = !ctx.voidAwakenings;
                    }
                    if (ctx.timeBuff != undefined) {
                        this.state.timeBonus = ctx.timeBuff;
                    }
                    if (ctx.timeIsMult != undefined) {
                        this.state.timeIsMult = ctx.timeIsMult;
                    }
                    if (ctx.rcvBuff != undefined) {
                        this.state.rcvMult = ctx.rcvBuff;
                    }
                    if (ctx.burst != undefined) {
                        this.state.burst = ctx.burst;
                    }
                    this.update();
                });
                this.teamPane.onMonsterSwap = (a, b) => {
                    const idxA = this.getMonsterIdx(Math.floor(a / 6), a % 6);
                    const idxB = this.getMonsterIdx(Math.floor(b / 6), b % 6);
                    monster_instance_1.MonsterInstance.swap(this.monsters[idxA], this.monsters[idxB]);
                };
                this.updateCb = () => { };
            }
            hasChange() {
                let storedTeam;
                try {
                    storedTeam = this.storage.getTeam(this.teamName);
                }
                catch (e) {
                    return true;
                }
                const currentJson = this.toJson();
                return !teamJsonEqual(currentJson, storedTeam);
            }
            updateState(ctx) {
                if (ctx.leadSwap != undefined) {
                    if (ctx.leadSwap >= 0 && ctx.leadSwap < 5) {
                        this.state.leadSwaps[this.activeTeamIdx] = ctx.leadSwap;
                    }
                    else {
                        console.error('Lead Swap index must be in range [0, 4]');
                    }
                }
                this.update();
            }
            setAction(idx) {
                this.action = idx;
            }
            skillBind() {
                const count = this.countAwakening(common_8.Awakening.SBR);
                if (count >= 5) {
                    return;
                }
                if (Math.random() * 5 > count) {
                    this.state.skills = false;
                }
            }
            openTeamTab() {
                this.teamPane.goToTab('Team');
            }
            setActiveMonsterIdx(idx) {
                const relativeIdx = idx % 6;
                if (this.playerMode == 2) {
                    if (idx == 5) {
                        idx = 6;
                    }
                    if (idx == 11) {
                        idx = 0;
                    }
                }
                // Determine which leadSwap we're talking about.
                const leadSwap = this.state.leadSwaps[Math.floor(idx / 6)];
                if (leadSwap) {
                    if (idx % 6 == 0) {
                        idx += leadSwap;
                    }
                    else if (idx % 6 == leadSwap) {
                        idx -= leadSwap;
                    }
                }
                if (this.activeMonster == idx) {
                    // If the current action equals the active, choose inherit instead.
                    // If current action is the inherit, reset to combos.
                    // Otherwise set action to the base monster's active.
                    if (this.action == 2 * relativeIdx) {
                        if (this.getActiveTeam()[relativeIdx].inheritId > 0) {
                            this.action++;
                        }
                        else {
                            this.action = -1;
                        }
                    }
                    else if (this.action == 2 * relativeIdx + 1 || this.getActiveTeam()[relativeIdx].getId() <= 0) {
                        this.action = -1;
                    }
                    else {
                        this.action = 2 * relativeIdx;
                    }
                }
                else {
                    this.onSelectMonster();
                }
                this.activeMonster = idx;
                this.updateCb(idx);
            }
            resetState(partial = false) {
                const state = this.state;
                if (partial) {
                    state.currentHp = state.currentHp / this.lastMaxHp * this.getHp();
                    this.lastMaxHp = this.getHp();
                    return;
                }
                Object.assign(this.state, DEFAULT_STATE);
                // Burst being a nested object means that editing state at all will cause
                // it to be propagated and continued.
                // Curse you, mutability!
                Object.assign(this.state.burst, DEFAULT_BURST);
                state.currentHp = this.getHp();
            }
            isMultiplayer() {
                return this.playerMode != 1;
            }
            toPdchu() {
                const strings = this.monsters.map((monster) => monster.toPdchu());
                function combine(s) {
                    return s.join(' / ');
                }
                switch (this.playerMode) {
                    case 1:
                        return combine(strings.slice(0, 6));
                    case 2:
                        return combine(strings.slice(0, 5)) + ' ; ' + combine(strings.slice(6, 11));
                    case 3:
                        return [combine(strings.slice(0, 6)), combine(strings.slice(6, 12)), combine(strings.slice(12, 18))].join(' ; ');
                }
                // Unhandled player mode.
                return '';
            }
            fromPdchu(s) {
                const teamStrings = s.split(';');
                // We don't support >3P.
                if (teamStrings.length > 3) {
                    teamStrings.length = 3;
                }
                this.setPlayerMode(teamStrings.length);
                const defaultMonster = '-1 | +0aw0lv1';
                for (let i = 0; i < teamStrings.length; i++) {
                    const multiplierRegex = /\*\s*\d$/;
                    if (!teamStrings[i]) {
                        teamStrings[i] = defaultMonster;
                    }
                    const monsterStrings = teamStrings[i].split('/')
                        .map((s) => s.trim())
                        .reduce((allStrings, monsterString) => {
                        const multiply = monsterString.match(multiplierRegex);
                        let count = 1;
                        if (multiply) {
                            count = Number(multiply[0][multiply[0].length - 1]);
                            monsterString = monsterString.substring(0, multiply.index);
                        }
                        for (let j = 0; j < count; j++) {
                            allStrings = allStrings.concat([monsterString]);
                        }
                        return allStrings;
                    }, []);
                    if (this.playerMode == 2) {
                        if (monsterStrings.length > 5) {
                            monsterStrings.length = 5;
                        }
                        while (monsterStrings.length < 5) {
                            monsterStrings.push(defaultMonster);
                        }
                    }
                    else {
                        if (monsterStrings.length > 6) {
                            monsterStrings.length = 6;
                        }
                        while (monsterStrings.length < 6) {
                            monsterStrings.push(defaultMonster);
                        }
                    }
                    const team = this.getTeamAt(i);
                    for (let j = 0; j < monsterStrings.length; j++) {
                        team[j].fromPdchu(monsterStrings[j]);
                    }
                }
                this.resetState();
                this.update();
            }
            getTeamAt(teamIdx) {
                const monsters = Array(6);
                for (let i = 0; i < 6; i++) {
                    monsters[i] = this.monsters[this.getMonsterIdx(teamIdx, i)];
                }
                return monsters;
            }
            getActiveTeam() {
                return this.getTeamAt(this.activeTeamIdx);
            }
            toJson() {
                return {
                    playerMode: this.playerMode,
                    title: this.teamName,
                    badges: this.badges.slice(),
                    description: this.description,
                    monsters: this.monsters.map((monster) => monster.toJson()),
                    tests: this.tests,
                };
            }
            fromJson(json) {
                this.setPlayerMode(json.playerMode || 1);
                this.action = -1;
                this.teamName = json.title || 'UNTITLED';
                this.description = json.description || '';
                if (json.badges) {
                    this.badges = json.badges;
                }
                else {
                    this.badges = [common_8.TeamBadge.NONE, common_8.TeamBadge.NONE, common_8.TeamBadge.NONE];
                }
                for (let i = 0; i < this.monsters.length; i++) {
                    if (i < json.monsters.length) {
                        this.monsters[i].fromJson(json.monsters[i]);
                    }
                    else {
                        this.monsters[i].setId(-1);
                    }
                }
                if (json.tests) {
                    this.tests = json.tests;
                }
                else {
                    this.tests = '';
                }
                this.update();
            }
            setPlayerMode(newMode) {
                if (newMode != 1 && newMode != 2 && newMode != 3) {
                    throw `Invalid player mode, must be 1, 2, or 3, got ${newMode}`;
                }
                const el = document.getElementById(`valeria-player-mode-${newMode}`);
                if (el instanceof HTMLInputElement) {
                    el.checked = true;
                }
                if (this.playerMode == 2) {
                    /**
                     0 1 2 3  4 6
                     6 7 8 9 10 0
                     x x x x x x
                     ->
                     0 1 2 3  4  5
                     6 7 8 9 10 11
                     x x x x  x  x
                     */
                    if (newMode == 3) {
                        this.monsters[5].copyFrom(this.monsters[6]);
                        this.monsters[11].copyFrom(this.monsters[0]);
                    }
                    if (newMode == 1) {
                        this.monsters[5].copyFrom(this.monsters[6]);
                    }
                }
                else if (this.playerMode == 1) {
                    if (newMode == 2) {
                        this.monsters[6].copyFrom(this.monsters[5]);
                    }
                }
                this.playerMode = newMode;
                if (this.activeTeamIdx >= newMode) {
                    this.setActiveTeamIdx(newMode - 1);
                }
                // TODO: Update UI to reflect this.
            }
            getHpPercent() {
                if (this.getHp() == 0) {
                    return 0;
                }
                return Math.round(100 * this.state.currentHp / this.getHp());
            }
            setActiveTeamIdx(idx) {
                if (idx >= this.playerMode || idx < 0) {
                    throw `Index should be [0, ${this.playerMode}]`;
                }
                if (this.activeTeamIdx == idx) {
                    return;
                }
                this.activeTeamIdx = idx;
                if (this.playerMode != 2) {
                    this.state.currentHp = this.getHp();
                }
                this.update();
                // this.reloadStatDisplay();
                // TODO: Update visuals and calculations when this happens.
            }
            /**
             * Obtain the monster at the requested position. This takes into account
             * lead swapping.
             */
            getMonsterIdx(teamIdx, localIdx) {
                // Adjust for P2 lead.
                if (this.playerMode == 2 && localIdx == 5 && teamIdx < 2) {
                    teamIdx = 1 - teamIdx;
                    localIdx = 0;
                }
                // Adjust for leadswaps.
                if (localIdx == 0) {
                    localIdx = this.state.leadSwaps[teamIdx];
                }
                else if (localIdx == this.state.leadSwaps[teamIdx]) {
                    localIdx = 0;
                }
                const idx = teamIdx * 6 + localIdx;
                return idx;
            }
            getIndividualHp(includeLeaderSkill = false, includeP2 = false) {
                const monsters = this.getActiveTeam();
                const partialLead = (monster) => {
                    return leaders.hp(monsters[0].getCard().leaderSkillId, {
                        monster: monster,
                        team: monsters,
                        isMultiplayer: this.isMultiplayer(),
                    });
                };
                const partialHelper = (monster) => {
                    return leaders.hp(monsters[5].getCard().leaderSkillId, {
                        monster: monster,
                        team: monsters,
                        isMultiplayer: this.isMultiplayer(),
                    });
                };
                let p1TeamHp = monsters.reduce((total, monster) => total + monster.countAwakening(common_8.Awakening.TEAM_HP), 0);
                let p2TeamHp = 0;
                if (includeP2) {
                    const p2Monsters = this.getTeamAt(this.activeTeamIdx ^ 1);
                    for (let i = 1; i < 5; i++) {
                        monsters.push(p2Monsters[i]);
                    }
                    p1TeamHp -= monsters[5].countAwakening(common_8.Awakening.TEAM_HP);
                    p2TeamHp = monsters.slice(5).reduce((total, monster) => total + monster.countAwakening(common_8.Awakening.TEAM_HP), 0);
                }
                if (!includeLeaderSkill) {
                    return monsters.map((monster) => monster.getHp(this.playerMode, this.state.awakenings));
                }
                const hps = [];
                for (let i = 0; i < monsters.length; i++) {
                    const monster = monsters[i];
                    if (!monster.id || monster.id <= 0) {
                        hps.push(0);
                        continue;
                    }
                    const hpMult = partialLead(monster) * partialHelper(monster);
                    const hpBase = monster.getHp(this.playerMode, this.state.awakenings);
                    let totalTeamHp = p1TeamHp;
                    if (monsters.length > 6 && i >= 5) {
                        totalTeamHp = p2TeamHp;
                    }
                    if (!this.state.awakenings) {
                        totalTeamHp = 0;
                    }
                    hps.push(Math.round(hpBase * hpMult * (1 + 0.05 * totalTeamHp)));
                }
                return hps;
            }
            getHp() {
                if (this.state.fixedHp) {
                    return this.state.fixedHp;
                }
                const individualHps = this.getIndividualHp(true, this.playerMode == 2);
                let total = individualHps.reduce((total, next) => total + next, 0);
                if (this.playerMode != 2) {
                    if (this.badges[this.activeTeamIdx] == common_8.TeamBadge.HP) {
                        total = Math.ceil(total * 1.05);
                    }
                    else if (this.badges[this.activeTeamIdx] == common_8.TeamBadge.HP_PLUS) {
                        total = Math.ceil(total * 1.15);
                    }
                }
                return total;
            }
            getEffectiveHp() {
                const baseHp = this.getHp();
                const monsters = this.getActiveTeam();
                const leadId = monsters[0].getCard().leaderSkillId;
                const helpId = monsters[5].getCard().leaderSkillId;
                const mult = leaders.damageMult(leadId) * leaders.damageMult(helpId);
                return Math.floor(baseHp / mult);
            }
            getIndividualRcv(includeLeaderSkill = false) {
                const rcvs = [];
                const monsters = this.getActiveTeam();
                if (!includeLeaderSkill) {
                    return monsters.map((monster) => monster.getRcv(this.playerMode, this.state.awakenings));
                }
                const partialLead = (monster) => {
                    return leaders.rcv(monsters[0].getCard().leaderSkillId, {
                        monster: monster,
                        team: monsters,
                        isMultiplayer: this.isMultiplayer(),
                    });
                };
                const partialHelper = (monster) => {
                    return leaders.rcv(monsters[5].getCard().leaderSkillId, {
                        monster: monster,
                        team: monsters,
                        isMultiplayer: this.isMultiplayer(),
                    });
                };
                const p1TeamRcv = 1 + monsters.reduce((total, monster) => total + monster.countAwakening(common_8.Awakening.TEAM_RCV), 0) * 0.10;
                for (let i = 0; i < monsters.length; i++) {
                    const monster = monsters[i];
                    if (!monster.id || monster.id <= 0) {
                        rcvs.push(0);
                        continue;
                    }
                    const rcvMult = partialLead(monster) * partialHelper(monster);
                    const rcvBase = monster.getRcv(this.playerMode, this.state.awakenings);
                    // let totalTeamRcv = p1TeamRcv;
                    // if (monsters.length > 6 && i >= 5) {
                    //   totalTeamRcv = p2TeamRcv;
                    // }
                    rcvs.push(Math.round(rcvBase * rcvMult * p1TeamRcv));
                }
                return rcvs;
            }
            // Base recovery before matching.
            getRcv() {
                const rcvs = this.getIndividualRcv(true);
                const totalRcv = rcvs.reduce((total, next) => total + next, 0);
                let total = totalRcv > 0 ? totalRcv : 0;
                if (this.playerMode != 2) {
                    if (this.badges[this.activeTeamIdx] == common_8.TeamBadge.RCV) {
                        total = Math.ceil(total * 1.25);
                    }
                    else if (this.badges[this.activeTeamIdx] == common_8.TeamBadge.RCV_PLUS) {
                        total = Math.ceil(total * 1.35);
                    }
                }
                return total;
            }
            getAutohealAwakening() {
                if (!this.state.awakenings) {
                    return 0;
                }
                const awakeningAutoheal = this.countAwakening(common_8.Awakening.AUTOHEAL) * 1000;
                let latentAutoheal = 0;
                for (const monster of this.getActiveTeam()) {
                    const c = monster.getCard();
                    const rcv = monster.calcScaleStat(c.maxRcv, c.minRcv, c.rcvGrowth);
                    if (rcv <= 0)
                        continue;
                    const latentCount = monster.latents.filter((latent) => latent == common_8.Latent.AUTOHEAL).length;
                    latentAutoheal += Math.round(0.15 * latentCount * rcv);
                }
                return awakeningAutoheal + latentAutoheal;
            }
            getTime() {
                const monsters = this.getActiveTeam();
                const leadId = monsters[0].getCard().leaderSkillId;
                const helperId = monsters[5].getCard().leaderSkillId;
                const fixedLead = leaders.fixedTime(leadId);
                const fixedHelper = leaders.fixedTime(helperId);
                if (fixedLead || fixedHelper) {
                    return Math.min(...[fixedLead, fixedHelper].filter(Boolean));
                }
                let time = 5;
                time += leaders.timeExtend(leadId) + leaders.timeExtend(helperId);
                time += this.countAwakening(common_8.Awakening.TIME, { includeTeamBadge: true }) * 0.5;
                for (const monster of monsters) {
                    time += monster.latents.filter((l) => l == common_8.Latent.TIME).length * 0.05;
                    time += monster.latents.filter((l) => l == common_8.Latent.TIME_PLUS).length * 0.12;
                }
                if (this.state.timeIsMult) {
                    time *= this.state.timeBonus;
                }
                else {
                    time += this.state.timeBonus;
                }
                return time;
            }
            getBoardWidth() {
                const monsterGroupsToCheck = [[this.monsters[0]]];
                switch (this.playerMode) {
                    case 1:
                        monsterGroupsToCheck[0].push(this.monsters[5]);
                        break;
                    case 2:
                        monsterGroupsToCheck[0].push(this.monsters[6]);
                        break;
                    case 3:
                        monsterGroupsToCheck[0].push(this.monsters[5]);
                        monsterGroupsToCheck.push([this.monsters[6], this.monsters[11]]);
                        monsterGroupsToCheck.push([this.monsters[12], this.monsters[17]]);
                }
                for (const [m1, m2] of monsterGroupsToCheck) {
                    if (leaders.bigBoard(m1.getCard(true).leaderSkillId)) {
                        continue;
                    }
                    if (leaders.bigBoard(m2.getCard(true).leaderSkillId)) {
                        continue;
                    }
                    // If neither of the leads have bigBoard, return 5 to default to the dungeon's.
                    return 5;
                }
                // All teams have bigBoard.
                return 7;
            }
            getBadge(idx = -1) {
                if (this.playerMode == 2) {
                    return common_8.TeamBadge.NONE;
                }
                if (idx < 0) {
                    idx = this.activeTeamIdx;
                }
                return this.badges[this.activeTeamIdx];
            }
            getDamageCombos(comboContainer) {
                comboContainer.bonusCombosLeader = 0;
                const pm = this.playerMode;
                const awoke = this.state.awakenings;
                const percentHp = this.getHpPercent();
                const monsters = this.getActiveTeam();
                const leadId = monsters[0].bound ? -1 : monsters[0].getCard().leaderSkillId;
                const helpId = monsters[5].bound ? -1 : monsters[5].getCard().leaderSkillId;
                const badge = this.getBadge();
                const partialAtk = (id, ping, healing) => leaders.atk(id, {
                    ping,
                    team: monsters,
                    percentHp,
                    comboContainer,
                    skillUsed: this.state.skillUsed,
                    isMultiplayer: this.isMultiplayer(),
                    healing,
                });
                const enhancedCounts = {
                    r: this.countAwakening(common_8.Awakening.OE_FIRE),
                    b: this.countAwakening(common_8.Awakening.OE_WATER),
                    g: this.countAwakening(common_8.Awakening.OE_WOOD),
                    l: this.countAwakening(common_8.Awakening.OE_LIGHT),
                    d: this.countAwakening(common_8.Awakening.OE_DARK),
                    h: this.countAwakening(common_8.Awakening.OE_HEART),
                };
                const rowTotals = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    '-1': 0,
                    '-2': 0,
                };
                const rowAwakenings = {
                    '-2': 0,
                    '-1': 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    0: this.countAwakening(common_8.Awakening.ROW_FIRE),
                    1: this.countAwakening(common_8.Awakening.ROW_WATER),
                    2: this.countAwakening(common_8.Awakening.ROW_WOOD),
                    3: this.countAwakening(common_8.Awakening.ROW_LIGHT),
                    4: this.countAwakening(common_8.Awakening.ROW_DARK),
                    5: this.countAwakening(common_8.Awakening.RECOVER_BIND),
                };
                // monsters = monsters.filter((monster) => monster.getId() > 0);
                const pings = Array(2 * monsters.length);
                const mults = [];
                for (let i = 0; i < pings.length; i++) {
                    mults.push({
                        base: 0,
                        combo: 1,
                        badge: 1,
                        lead: 1,
                        help: 1,
                        awakenings: 1,
                        final: 0,
                    });
                }
                const NO_ONE = new monster_instance_1.MonsterInstance(-1, () => null);
                for (let i = 0; i < monsters.length; i++) {
                    if (monsters[i].getId() <= 0 || monsters[i].bound) {
                        pings[i] = new damage_ping_1.DamagePing(NO_ONE, common_8.Attribute.NONE);
                        pings[i + 6] = new damage_ping_1.DamagePing(NO_ONE, common_8.Attribute.NONE);
                        continue;
                    }
                    const m = monsters[i];
                    pings[i] = new damage_ping_1.DamagePing(m, m.getAttribute());
                    pings[i + monsters.length] = new damage_ping_1.DamagePing(m, m.getSubattribute());
                    pings[i + monsters.length].isSub = true;
                }
                let potentialComboOrbPlus = 0;
                for (const c of 'rbgld') {
                    const attr = common_8.COLORS.indexOf(c);
                    for (const combo of comboContainer.combos[c]) {
                        let baseMultiplier = (combo.count + 1) * 0.25;
                        if (combo.enhanced) {
                            baseMultiplier *= (1 + 0.06 * combo.enhanced);
                            if (awoke && enhancedCounts[c]) {
                                baseMultiplier *= (1 + enhancedCounts[c] * 0.07);
                            }
                        }
                        if (combo.shape == common_8.Shape.ROW) {
                            rowTotals[attr] += rowAwakenings[attr];
                        }
                        for (const ping of pings) {
                            if (!ping || ping.attribute != attr) {
                                continue;
                            }
                            let curAtk = ping.source.getAtk(pm, awoke);
                            curAtk = common_8.Round.UP(curAtk * baseMultiplier);
                            if (ping.isSub) {
                                const divisor = ping.attribute == ping.source.getAttribute() ? 10 : 3;
                                curAtk = common_8.Round.UP(curAtk / divisor);
                            }
                            let multiplier = 1;
                            if (awoke) {
                                if (combo.count == 4) {
                                    multiplier *= (1.5 ** ping.source.countAwakening(common_8.Awakening.TPA, pm));
                                }
                                else if (combo.shape == common_8.Shape.L) {
                                    multiplier *= (1.5 ** ping.source.countAwakening(common_8.Awakening.L_UNLOCK, pm));
                                }
                                else if (combo.shape == common_8.Shape.BOX) {
                                    const vdpCount = ping.source.countAwakening(common_8.Awakening.VDP, pm);
                                    if (vdpCount) {
                                        multiplier *= (2.5 ** vdpCount);
                                        ping.ignoreVoid = true;
                                    }
                                }
                                let comboOrbs = ping.source.countAwakening(common_8.Awakening.COMBO_ORB);
                                if (combo.count >= 10 && combo.count <= 12 &&
                                    // Monsters with the same attribute and subattribute should not be
                                    // counted twice.
                                    (!ping.isSub || ping.source.getAttribute() != ping.attribute)) {
                                    potentialComboOrbPlus += comboOrbs;
                                }
                            }
                            // Handle burst.
                            const burst = this.state.burst;
                            if (!burst.typeRestrictions.length || ping.source.anyTypes(burst.typeRestrictions)) {
                                if (!burst.attrRestrictions.length || burst.attrRestrictions.includes(ping.attribute)) {
                                    let burstMultiplier = burst.multiplier;
                                    for (const awakening of burst.awakenings) {
                                        burstMultiplier += this.countAwakening(awakening) * burst.awakeningScale;
                                    }
                                    multiplier *= burstMultiplier;
                                }
                            }
                            ping.add(common_8.Round.UP(curAtk * multiplier));
                        }
                    }
                }
                for (let i = 0; i < pings.length; i++) {
                    mults[i].base = pings[i].damage;
                }
                // Apply poison damage.
                let poison = 0;
                for (const c of 'pm') {
                    for (const combo of comboContainer.combos[c]) {
                        let multiplier = 0;
                        if (combo.attribute == common_8.Attribute.POISON) {
                            multiplier = (combo.count + 1) * 0.05;
                        }
                        else if (combo.attribute == common_8.Attribute.MORTAL_POISON) {
                            multiplier = (combo.count + 1) * 0.125;
                        }
                        poison += this.getHp() * multiplier;
                    }
                }
                poison = Math.round(poison);
                let healingFromCombos = 0;
                const teamRcvAwakenings = this.countAwakening(common_8.Awakening.TEAM_RCV);
                let trueBonusAttack = 0;
                const partialRcv = (id, monster) => leaders.rcv(id, {
                    monster,
                    team: monsters,
                    isMultiplayer: this.isMultiplayer(),
                });
                let rcvBadgeMult = 1;
                if (badge == common_8.TeamBadge.RCV) {
                    rcvBadgeMult = 1.25;
                }
                else if (badge == common_8.TeamBadge.RCV_PLUS) {
                    rcvBadgeMult = 1.35;
                }
                for (const combo of comboContainer.combos['h']) {
                    let multiplier = (combo.count + 1) * 0.25;
                    if (combo.enhanced) {
                        multiplier *= (1 + 0.06 * combo.enhanced);
                        if (awoke && enhancedCounts[common_8.Attribute.HEART]) {
                            multiplier *= (1 + enhancedCounts[common_8.Attribute.HEART] * 0.07);
                        }
                    }
                    multiplier *= this.state.rcvMult;
                    if (awoke) {
                        if (combo.shape == common_8.Shape.COLUMN) {
                            trueBonusAttack += this.countAwakening(common_8.Awakening.BONUS_ATTACK);
                        }
                        if (combo.shape == common_8.Shape.BOX) {
                            trueBonusAttack += (99 * this.countAwakening(common_8.Awakening.BONUS_ATTACK_SUPER));
                        }
                        multiplier *= (1 + 0.1 * teamRcvAwakenings);
                    }
                    let healingFromCombo = 0;
                    for (const monster of monsters) {
                        let rcv = monster.getRcv(pm, awoke);
                        if (awoke && combo.count == 4) {
                            rcv *= (1.5 ** monster.countAwakening(common_8.Awakening.OE_HEART, pm));
                        }
                        const rcvMult = partialRcv(leadId, monster) * partialRcv(helpId, monster);
                        healingFromCombo += common_8.Round.UP(rcv * multiplier * rcvMult * rcvBadgeMult);
                    }
                    if (healingFromCombo > 0) {
                        healingFromCombos += healingFromCombo;
                    }
                }
                comboContainer.setBonusComboLeader(leaders.plusCombo(leadId, { team: monsters, comboContainer }) +
                    leaders.plusCombo(helpId, { team: monsters, comboContainer }));
                // Currently max of 2 combo orbs can be added at any time.
                comboContainer.setBonusComboOrb(Math.min(potentialComboOrbPlus, 2));
                const comboCount = comboContainer.comboCount();
                const comboMultiplier = comboCount * 0.25 + 0.75;
                for (let i = 0; i < pings.length; i++) {
                    mults[i].combo = comboMultiplier;
                    if (pings[i]) {
                        pings[i].multiply(comboMultiplier, common_8.Round.UP);
                    }
                }
                healingFromCombos = common_8.Round.UP(healingFromCombos * comboMultiplier);
                // Apply awakenings.
                // Known order according to PDC:
                // (7c/10c), (80%/50%), Rows, Sfua, L-Guard
                // Poison Blessing occurs after rows.  Unknown relative to L-Guard as it's impossible to get both.
                // Jammer applies after Sfua.
                // Assuming:
                // (7c/10c), (80%/50%), Rows, Sfua, L-Guard, JammerBless, PoisonBless
                if (awoke) {
                    for (let i = 0; i < pings.length; i++) {
                        const ping = pings[i];
                        if (!ping || ping.damage == 0) {
                            continue;
                        }
                        const baseDamage = ping.damage;
                        const apply = (awakening, multiplier) => {
                            const count = ping.source.countAwakening(awakening, pm);
                            if (count) {
                                ping.multiply(multiplier ** ping.source.countAwakening(awakening, pm), common_8.Round.NEAREST);
                            }
                        };
                        if (comboCount >= 7) {
                            apply(common_8.Awakening.COMBO_7, 2);
                        }
                        if (comboCount >= 10) {
                            apply(common_8.Awakening.COMBO_10, 5);
                        }
                        if (percentHp <= 50) {
                            apply(common_8.Awakening.HP_LESSER, 2);
                        }
                        if (percentHp >= 80) {
                            apply(common_8.Awakening.HP_GREATER, 1.5);
                        }
                        if (rowTotals[ping.attribute]) {
                            ping.multiply(1 + 0.15 * rowTotals[ping.attribute], common_8.Round.NEAREST);
                        }
                        if (comboContainer.combos['h'].some((combo) => combo.shape == common_8.Shape.BOX)) {
                            apply(common_8.Awakening.BONUS_ATTACK_SUPER, 2);
                        }
                        if (comboContainer.combos['h'].some((combo) => combo.shape == common_8.Shape.L)) {
                            apply(common_8.Awakening.L_GUARD, 1.5);
                        }
                        if (comboContainer.combos['j'].length) {
                            // TODO: Change when Jammer Boost is buffed.
                            apply(common_8.Awakening.JAMMER_BOOST, 1.5);
                        }
                        if (comboContainer.combos['p'].length || comboContainer.combos['m'].length) {
                            apply(common_8.Awakening.POISON_BOOST, 2);
                        }
                        mults[i].awakenings = pings[i].damage / baseDamage;
                    }
                }
                let atkBadgeMult = 1;
                if (badge == common_8.TeamBadge.ATK) {
                    atkBadgeMult = 1.05;
                }
                else if (badge == common_8.TeamBadge.ATK_PLUS) {
                    atkBadgeMult = 1.15;
                }
                for (let i = 0; i < pings.length; i++) {
                    const ping = pings[i];
                    if (!ping || !ping.damage) {
                        continue;
                    }
                    let val = ping.damage;
                    val = Math.fround(val) * Math.fround(partialAtk(leadId, ping, healingFromCombos) * 100) / Math.fround(100);
                    val = Math.fround(val) * Math.fround(partialAtk(helpId, ping, healingFromCombos) * 100) / Math.fround(100);
                    mults[i].badge = atkBadgeMult;
                    mults[i].lead = partialAtk(leadId, ping, healingFromCombos);
                    mults[i].help = partialAtk(helpId, ping, healingFromCombos);
                    ping.damage = Math.round(val * atkBadgeMult);
                    mults[i].final = ping.damage;
                }
                const healingAwakening = this.getAutohealAwakening();
                const healingLeader = leaders.autoHeal(leadId) * Math.max(0, monsters[0].getRcv(pm, awoke))
                    + leaders.autoHeal(helpId) * Math.max(0, monsters[5].getRcv(pm, awoke));
                const healing = healingFromCombos - poison + healingAwakening + healingLeader;
                trueBonusAttack += leaders.trueBonusAttack(leadId, {
                    team: monsters, comboContainer
                }) + leaders.trueBonusAttack(helpId, {
                    team: monsters, comboContainer
                });
                for (const ping of pings) {
                    ping.damage = Math.min(ping.damage, common_8.INT_CAP);
                }
                console.log(mults);
                return {
                    pings,
                    healing,
                    trueBonusAttack,
                };
            }
            update() {
                this.teamPane.update(this.playerMode, this.teamName, this.description, this.badges);
                for (let teamIdx = 0; teamIdx < 3; teamIdx++) {
                    for (let monsterIdx = 0; monsterIdx < 6; monsterIdx++) {
                        const displayIndex = 6 * teamIdx + monsterIdx;
                        const actualIndex = this.getMonsterIdx(teamIdx, monsterIdx);
                        // We should only show the lead swap icon on the lead who is now the sub.
                        const showSwap = Boolean(displayIndex != actualIndex && monsterIdx && monsterIdx < 5);
                        let renderData = this.monsters[actualIndex].getRenderData(this.playerMode, showSwap);
                        if (!templates_5.SETTINGS.getBool(common_8.BoolSetting.SHOW_COOP_PARTNER)
                            && this.playerMode == 2 && monsterIdx == 5) {
                            renderData = {
                                plusses: 0,
                                unavailableReason: '',
                                id: -1,
                                awakenings: 0,
                                superAwakeningIdx: -1,
                                level: 1,
                                inheritId: -1,
                                inheritLevel: 1,
                                inheritPlussed: false,
                                latents: [],
                                showSwap: false,
                                showTransform: false,
                                activeTransform: false,
                            };
                        }
                        this.monsters[displayIndex].update(this.playerMode, renderData);
                    }
                }
                this.teamPane.updateStats(this.getStats());
                const ns = [];
                this.teamPane.updateBattle({
                    currentHp: this.state.currentHp,
                    maxHp: this.getHp(),
                    leadSwap: this.state.leadSwaps[this.activeTeamIdx],
                    voids: [this.state.voidDamageAbsorb, this.state.voidAttributeAbsorb, this.state.voidDamageVoid, !this.state.awakenings],
                    fixedHp: this.state.fixedHp,
                    ids: ns.concat(...this.getActiveTeam().map((m) => [m.getId(), m.inheritId])),
                    burst: this.state.burst,
                    timeBuff: this.state.timeBonus,
                    timeIsMult: this.state.timeIsMult,
                    rcvBuff: this.state.rcvMult,
                });
                this.updateCb(this.activeMonster);
            }
            makeTeamContext(idx) {
                const monsters = this.getTeamAt(idx);
                const opts = {
                    includeTeamBadge: true,
                };
                const LEADER = monsters[0].makeTestContext(this.playerMode);
                const HELPER = monsters[5].makeTestContext(this.playerMode);
                const SUB_1 = monsters[1].makeTestContext(this.playerMode);
                const SUB_2 = monsters[2].makeTestContext(this.playerMode);
                const SUB_3 = monsters[3].makeTestContext(this.playerMode);
                const SUB_4 = monsters[4].makeTestContext(this.playerMode);
                const leadId = monsters[0].getCard().leaderSkillId;
                const helpId = monsters[5].getCard().leaderSkillId;
                const hasAutofua = leaders.bonusAttack(leadId) || leaders.trueBonusAttack(leadId) || leaders.bonusAttack(helpId) || leaders.trueBonusAttack(helpId);
                const result = {
                    HP: this.getHp(),
                    EFFECTIVE_HP: this.getEffectiveHp(),
                    RCV: this.getRcv(),
                    TIME: this.getTime(),
                    LEADER, HELPER, SUB_1, SUB_2, SUB_3, SUB_4,
                    ATTRIBUTES: LEADER.ATTRIBUTE | LEADER.SUBATTRIBUTE | HELPER.ATTRIBUTE | HELPER.SUBATTRIBUTE | SUB_1.ATTRIBUTE | SUB_1.SUBATTRIBUTE | SUB_2.ATTRIBUTE | SUB_2.SUBATTRIBUTE | SUB_3.ATTRIBUTE | SUB_3.SUBATTRIBUTE | SUB_4.ATTRIBUTE | SUB_4.SUBATTRIBUTE,
                    SB: this.countAwakening(common_8.Awakening.SKILL_BOOST, opts),
                    SBR: this.countAwakening(common_8.Awakening.SBR, opts),
                    FUA: this.countAwakening(common_8.Awakening.BONUS_ATTACK),
                    SFUA: this.countAwakening(common_8.Awakening.BONUS_ATTACK_SUPER),
                    RESIST_BLIND: this.countAwakening(common_8.Awakening.RESIST_BLIND, opts),
                    RESIST_POISON: this.countAwakening(common_8.Awakening.RESIST_POISON, opts),
                    RESIST_JAMMER: this.countAwakening(common_8.Awakening.RESIST_JAMMER, opts),
                    RESIST_CLOUD: this.countAwakening(common_8.Awakening.RESIST_CLOUD),
                    RESIST_TAPE: this.countAwakening(common_8.Awakening.RESIST_TAPE),
                    GUARD_BREAK: this.countAwakening(common_8.Awakening.GUARD_BREAK),
                    RESIST_FIRE: this.countAwakening(common_8.Awakening.RESIST_FIRE) * 7 + this.countLatent(common_8.Latent.RESIST_FIRE) + this.countLatent(common_8.Latent.RESIST_FIRE_PLUS) * 2.5,
                    RESIST_WATER: this.countAwakening(common_8.Awakening.RESIST_WATER) * 7 + this.countLatent(common_8.Latent.RESIST_WATER) + this.countLatent(common_8.Latent.RESIST_WATER_PLUS) * 2.5,
                    RESIST_WOOD: this.countAwakening(common_8.Awakening.RESIST_WOOD) * 7 + this.countLatent(common_8.Latent.RESIST_WOOD) + this.countLatent(common_8.Latent.RESIST_WOOD_PLUS) * 2.5,
                    RESIST_LIGHT: this.countAwakening(common_8.Awakening.RESIST_LIGHT) * 7 + this.countLatent(common_8.Latent.RESIST_LIGHT) + this.countLatent(common_8.Latent.RESIST_LIGHT_PLUS) * 2.5,
                    RESIST_DARK: this.countAwakening(common_8.Awakening.RESIST_DARK) * 7 + this.countLatent(common_8.Latent.RESIST_DARK) + this.countLatent(common_8.Latent.RESIST_DARK_PLUS) * 2.5,
                    // Leader Skill capabilities.
                    AUTOFUA: hasAutofua ? team_conformance_1.CompareBoolean.TRUE : team_conformance_1.CompareBoolean.FALSE,
                };
                return result;
            }
            makeTestContext() {
                const ctx = {
                    MODE: this.playerMode,
                    P1: this.makeTeamContext(0),
                    // Constants.
                    FIRE: 1 << 0,
                    WATER: 1 << 1,
                    WOOD: 1 << 2,
                    LIGHT: 1 << 3,
                    DARK: 1 << 4,
                    ALL_ATTRIBUTES: 31,
                    TRUE: team_conformance_1.CompareBoolean.TRUE,
                    FALSE: team_conformance_1.CompareBoolean.FALSE,
                };
                if (this.playerMode > 1) {
                    ctx.P2 = this.makeTeamContext(1);
                }
                if (this.playerMode > 2) {
                    ctx.P3 = this.makeTeamContext(2);
                }
                return ctx;
            }
            countAwakening(awakening, opts = {}) {
                if (!this.state.awakenings) {
                    return 0;
                }
                const monsters = this.getActiveTeam();
                if (this.playerMode == 2 && SHARED_AWAKENINGS.has(awakening)) {
                    const p2Monsters = this.getTeamAt(this.activeTeamIdx ^ 1);
                    for (let i = 1; i < 5; i++) {
                        monsters.push(p2Monsters[i]);
                    }
                }
                let initialCount = monsters.reduce((total, monster) => total + monster.countAwakening(awakening, this.playerMode, opts.ignoreTransform || false), 0);
                if (this.playerMode != 2 && opts.includeTeamBadge) {
                    const maybeAwakeningCount = common_8.TeamBadgeToAwakening.get(this.badges[this.activeTeamIdx]);
                    if (maybeAwakeningCount && maybeAwakeningCount.awakening == awakening) {
                        initialCount += maybeAwakeningCount.count;
                    }
                }
                return initialCount;
            }
            countLatent(latent) {
                if (!this.state.awakenings) {
                    return 0;
                }
                const monsters = this.getActiveTeam();
                return monsters.reduce((total, monster) => total + monster.latents.filter((l) => l == latent).length, 0);
            }
            damage(amount, attribute, comboContainer) {
                debugger_2.debug.print(`Team being hit for ${amount} of ${common_8.AttributeToName.get(attribute)}`);
                let multiplier = 1;
                if (this.state.attributesShielded.includes(attribute)) {
                    multiplier = 0;
                    debugger_2.debug.print('Team is avoiding all damage from ' + common_8.AttributeToName.get(attribute));
                }
                const team = this.getActiveTeam();
                const leader = team[0].getCard().leaderSkillId;
                const helper = team[5].getCard().leaderSkillId;
                const percentHp = this.getHpPercent();
                const ctx = {
                    attribute,
                    team,
                    comboContainer,
                    percentHp,
                    healing: 0,
                };
                const leaderMultiplier = leaders.damageMult(leader, ctx) * leaders.damageMult(helper, ctx);
                if (leaderMultiplier != 1) {
                    debugger_2.debug.print(`Damage reduced to ${(leaderMultiplier * 100).toFixed(2)}% from leader skills.`);
                    multiplier *= leaderMultiplier;
                }
                if (this.state.shieldPercent) {
                    const shieldMultiplier = (100 - this.state.shieldPercent) / 100;
                    multiplier *= shieldMultiplier;
                    debugger_2.debug.print(`Damage reduced to ${shieldMultiplier.toFixed(2)}x due to shields.`);
                }
                // Assuming stacking L-Guards.
                if (comboContainer.combos['h'].some((c) => c.shape == common_8.Shape.L)) {
                    let lGuardMultiplier = 1 - this.countAwakening(common_8.Awakening.L_GUARD) * 0.05;
                    if (lGuardMultiplier < 0) {
                        lGuardMultiplier = 0;
                    }
                    if (lGuardMultiplier != 1) {
                        multiplier *= lGuardMultiplier;
                        debugger_2.debug.print(`Damage reduced to ${lGuardMultiplier.toFixed(2)}x due to L-Guard`);
                    }
                }
                let attrMultiplier = 1;
                switch (attribute) {
                    case common_8.Attribute.FIRE:
                        attrMultiplier -= this.countAwakening(common_8.Awakening.RESIST_FIRE) * 0.07;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_FIRE) * 0.01;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_FIRE_PLUS) * 0.025;
                        break;
                    case common_8.Attribute.WATER:
                        attrMultiplier -= this.countAwakening(common_8.Awakening.RESIST_WATER) * 0.07;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_WATER) * 0.01;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_WATER_PLUS) * 0.025;
                        break;
                    case common_8.Attribute.WOOD:
                        attrMultiplier -= this.countAwakening(common_8.Awakening.RESIST_WOOD) * 0.07;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_WOOD) * 0.01;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_WOOD_PLUS) * 0.025;
                        break;
                    case common_8.Attribute.LIGHT:
                        attrMultiplier -= this.countAwakening(common_8.Awakening.RESIST_LIGHT) * 0.07;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_LIGHT) * 0.01;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_LIGHT_PLUS) * 0.025;
                        break;
                    case common_8.Attribute.DARK:
                        attrMultiplier -= this.countAwakening(common_8.Awakening.RESIST_DARK) * 0.07;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_DARK) * 0.01;
                        attrMultiplier -= this.countLatent(common_8.Latent.RESIST_DARK_PLUS) * 0.025;
                        break;
                    default:
                        console.warn('Unhandled damage: ' + attribute);
                }
                attrMultiplier = Math.max(0, attrMultiplier);
                if (attrMultiplier != 1) {
                    multiplier *= (attrMultiplier);
                    debugger_2.debug.print(`Damage reduced to ${(100 * attrMultiplier).toFixed(1)}% due to Attribute Resist Awakenings and Latents`);
                }
                amount = Math.ceil(amount * multiplier);
                debugger_2.debug.print(`Team hit for ${amount}, which is ${(multiplier * 100).toFixed(2)}% of the original damage`);
                this.state.currentHp -= amount;
                if (this.state.currentHp < 0) {
                    debugger_2.debug.print(`Team was overkilled by ${-1 * this.state.currentHp}`);
                }
                this.state.currentHp = Math.max(0, this.state.currentHp) || 0;
                // Resolve
                // TODO: Account for 1-2 HP.
                if (this.state.currentHp == 0) {
                    if (percentHp >= Math.min(leaders.resolve(leader), leaders.resolve(helper))) {
                        this.state.currentHp = 1;
                        debugger_2.debug.print('RESOLVE TRIGGERED, team maintains 1 HP');
                    }
                }
            }
            heal(amount, percent = 0) {
                this.state.currentHp += amount;
                if (percent) {
                    this.state.currentHp += Math.ceil(this.getHp() * percent / 100);
                }
                this.state.currentHp = Math.min(this.state.currentHp, this.getHp());
            }
            getStats() {
                const team = this.getActiveTeam();
                const cds = [];
                for (const monster of team) {
                    const baseCd = monster.getCooldown();
                    const inheritCd = monster.getCooldownInherit();
                    if (baseCd && baseCd != inheritCd) {
                        cds.push(`${baseCd}(${inheritCd})`);
                    }
                    else if (baseCd && baseCd == inheritCd) {
                        cds.push(`${baseCd}`);
                    }
                    else if (!baseCd && inheritCd) {
                        cds.push(`?(? + ${inheritCd})`);
                    }
                    else {
                        cds.push('');
                    }
                }
                const atks = this.getActiveTeam().map((monster) => monster.getAtk(this.playerMode, this.state.awakenings));
                const counts = new Map();
                const opts = {
                    includeTeamBadge: true,
                };
                // General
                counts.set(common_8.Awakening.SKILL_BOOST, this.countAwakening(common_8.Awakening.SKILL_BOOST, opts));
                counts.set(common_8.Awakening.TIME, this.countAwakening(common_8.Awakening.TIME, opts));
                counts.set(common_8.Awakening.SOLOBOOST, this.countAwakening(common_8.Awakening.SOLOBOOST));
                counts.set(common_8.Awakening.BONUS_ATTACK, this.countAwakening(common_8.Awakening.BONUS_ATTACK));
                counts.set(common_8.Awakening.BONUS_ATTACK_SUPER, this.countAwakening(common_8.Awakening.BONUS_ATTACK_SUPER));
                counts.set(common_8.Awakening.L_GUARD, this.countAwakening(common_8.Awakening.L_GUARD));
                // Resists
                counts.set(common_8.Awakening.SBR, this.countAwakening(common_8.Awakening.SBR, opts));
                counts.set(common_8.Awakening.RESIST_POISON, this.countAwakening(common_8.Awakening.RESIST_POISON, opts));
                counts.set(common_8.Awakening.RESIST_BLIND, this.countAwakening(common_8.Awakening.RESIST_BLIND, opts));
                counts.set(common_8.Awakening.RESIST_JAMMER, this.countAwakening(common_8.Awakening.RESIST_JAMMER, opts));
                counts.set(common_8.Awakening.RESIST_CLOUD, this.countAwakening(common_8.Awakening.RESIST_CLOUD));
                counts.set(common_8.Awakening.RESIST_TAPE, this.countAwakening(common_8.Awakening.RESIST_TAPE));
                // OE
                counts.set(common_8.Awakening.OE_FIRE, this.countAwakening(common_8.Awakening.OE_FIRE));
                counts.set(common_8.Awakening.OE_WATER, this.countAwakening(common_8.Awakening.OE_WATER));
                counts.set(common_8.Awakening.OE_WOOD, this.countAwakening(common_8.Awakening.OE_WOOD));
                counts.set(common_8.Awakening.OE_LIGHT, this.countAwakening(common_8.Awakening.OE_LIGHT));
                counts.set(common_8.Awakening.OE_DARK, this.countAwakening(common_8.Awakening.OE_DARK));
                counts.set(common_8.Awakening.OE_HEART, this.countAwakening(common_8.Awakening.OE_HEART));
                // Rows
                counts.set(common_8.Awakening.ROW_FIRE, this.countAwakening(common_8.Awakening.ROW_FIRE));
                counts.set(common_8.Awakening.ROW_WATER, this.countAwakening(common_8.Awakening.ROW_WATER));
                counts.set(common_8.Awakening.ROW_WOOD, this.countAwakening(common_8.Awakening.ROW_WOOD));
                counts.set(common_8.Awakening.ROW_LIGHT, this.countAwakening(common_8.Awakening.ROW_LIGHT));
                counts.set(common_8.Awakening.ROW_DARK, this.countAwakening(common_8.Awakening.ROW_DARK));
                counts.set(common_8.Awakening.RECOVER_BIND, this.countAwakening(common_8.Awakening.RECOVER_BIND));
                // Resists
                counts.set(common_8.Awakening.RESIST_FIRE, this.countAwakening(common_8.Awakening.RESIST_FIRE));
                counts.set(common_8.Awakening.RESIST_WATER, this.countAwakening(common_8.Awakening.RESIST_WATER));
                counts.set(common_8.Awakening.RESIST_WOOD, this.countAwakening(common_8.Awakening.RESIST_WOOD));
                counts.set(common_8.Awakening.RESIST_LIGHT, this.countAwakening(common_8.Awakening.RESIST_LIGHT));
                counts.set(common_8.Awakening.RESIST_DARK, this.countAwakening(common_8.Awakening.RESIST_DARK));
                counts.set(common_8.Awakening.AUTOHEAL, this.countAwakening(common_8.Awakening.AUTOHEAL));
                const testResult = team_conformance_1.runTests(this.tests, this.makeTestContext());
                const monsters = this.getActiveTeam();
                const leadId = monsters[0].getCard().leaderSkillId;
                const helpId = monsters[5].getCard().leaderSkillId;
                const leadBaseId = monsters[0].getCard(true).leaderSkillId;
                const helpBaseId = monsters[5].getCard(true).leaderSkillId;
                return {
                    hps: this.getIndividualHp(),
                    atks,
                    rcvs: this.getIndividualRcv(),
                    cds,
                    totalHp: this.getHp(),
                    effectiveHp: this.getEffectiveHp(),
                    totalRcv: this.getRcv(),
                    totalTime: this.getTime(),
                    counts,
                    tests: this.tests,
                    testResult,
                    lead: {
                        bigBoard: leaders.bigBoard(leadBaseId) || leaders.bigBoard(helpBaseId),
                        hp: leaders.hp(leadId) * leaders.hp(helpId),
                        atk: leaders.atk(leadId) * leaders.atk(helpId),
                        rcv: leaders.rcv(leadId) * leaders.rcv(helpId),
                        damageMult: leaders.damageMult(leadId) * leaders.damageMult(helpId),
                        plusCombo: leaders.plusCombo(leadId) + leaders.plusCombo(helpId),
                        bonusAttack: leaders.bonusAttack(leadId) * monsters[0].getAtk(this.playerMode, this.state.awakenings) + leaders.bonusAttack(helpId) * monsters[5].getAtk(this.playerMode, this.state.awakenings),
                        trueBonusAttack: leaders.trueBonusAttack(leadId) + leaders.trueBonusAttack(helpId),
                    },
                };
            }
        }
        exports.Team = Team;
    });
    define("enemy_instance", ["require", "exports", "common", "ilmina_stripped"], function (require, exports, common_9, ilmina_stripped_6) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function calcScaleStat(max, min, level, growth) {
            const diff = max - min;
            const frac = (level - 1) / 9;
            const added = Math.round(Math.pow(frac, growth) * diff);
            return min + added;
        }
        const Advantage = {
            0: 2,
            1: 0,
            2: 1,
            3: 4,
            4: 3,
        };
        const Disadvantage = {
            0: 1,
            1: 2,
            2: 0,
        };
        class EnemyInstance {
            constructor() {
                this.id = 4014;
                this.lv = 10;
                this.hp = -1;
                // Used for determining moveset.
                this.charges = 0;
                this.flags = 0;
                this.counter = 0;
                this.forceAttack = false; // If true, next attack must be basic.
                this.otherEnemyHp = 100;
                // Values that can change during battle.
                this.currentHp = 1;
                this.currentAttribute = -1; // -1 is main, -2 is sub.
                this.statusShield = false;
                this.shieldPercent = 0; // Damage is multiplied by (100 - shieldPercent) / 100
                this.attributeAbsorb = []; // Each attribute absorbed.
                this.comboAbsorb = 0; // Combos of this or fewer are absorbed.
                this.damageAbsorb = 0;
                this.damageVoid = 0;
                this.attackMultiplier = 1; // Enrage
                this.turnsRemaining = 1; // Not to be used yet.
                this.turnCounterOverride = -1; // Not to be used yet.
                this.invincible = false;
                // Debuffs by players
                this.ignoreDefensePercent = 0;
                this.poison = 0;
                this.delayed = false; // Not to be used yet.
                this.dungeonMultipliers = {
                    hp: new common_9.Rational(),
                    atk: new common_9.Rational(),
                    def: new common_9.Rational(),
                };
            }
            setLevel(lv) {
                this.lv = lv;
            }
            getHp() {
                const c = this.getCard();
                return this.dungeonMultipliers.hp.multiply(calcScaleStat(c.enemyHpAtLv10, c.enemyHpAtLv1, this.lv, c.enemyHpCurve), Math.ceil);
            }
            setHp(hp) {
                if (hp > this.getHp()) {
                    hp = this.getHp();
                }
                if (hp < 0) {
                    hp = 0;
                }
                this.currentHp = hp;
                if (this.getHpPercent() <= 50 && this.currentAttribute == -1 && this.getCard().subattribute >= 0) {
                    this.currentAttribute = this.getCard().subattribute;
                }
            }
            getHpPercent() {
                return Math.round(100 * this.currentHp / this.getHp());
            }
            getAtkBase() {
                const c = this.getCard();
                return this.dungeonMultipliers.atk.multiply(calcScaleStat(c.enemyAtkAtLv10, c.enemyAtkAtLv1, this.lv, c.enemyAtkCurve), Math.ceil);
            }
            getAtk() {
                return Math.ceil(this.getAtkBase() * this.attackMultiplier);
            }
            getDefBase() {
                const c = this.getCard();
                return this.dungeonMultipliers.def.multiply(calcScaleStat(c.enemyDefAtLv10, c.enemyDefAtLv1, this.lv, c.enemyDefCurve), Math.ceil);
            }
            getDef() {
                const defMultiplier = (100 - this.ignoreDefensePercent) / 100;
                return Math.ceil(defMultiplier * this.getDefBase());
            }
            getSuperResolve() {
                const superResolveSkills = this.getEnemySkills(129);
                if (!superResolveSkills.length) {
                    return {
                        minHp: 0,
                        triggersAt: 0,
                    };
                }
                if (superResolveSkills.length > 1) {
                    console.warn('Multiple super resolve skills detected.  Only using first.');
                }
                return {
                    minHp: superResolveSkills[0].skillArgs[0],
                    triggersAt: superResolveSkills[0].skillArgs[1],
                };
            }
            getEnemySkills(internalEffectId = -1) {
                const c = this.getCard();
                return c.enemySkills
                    .map((skill) => skill.enemySkillId)
                    .map((id) => ilmina_stripped_6.floof.getEnemySkill(id))
                    .filter((skill) => internalEffectId < 0 || skill.internalEffectId == internalEffectId);
            }
            getResolve() {
                const resolveSkills = this.getEnemySkills(73);
                if (!resolveSkills.length) {
                    return 0;
                }
                if (resolveSkills.length > 1) {
                    console.warn('Multiple resolve skills detected. Only using first');
                }
                return resolveSkills[0].skillArgs[0];
            }
            getTypeResists() {
                const resistTypeSkills = this.getEnemySkills(118);
                if (!resistTypeSkills.length) {
                    return { types: [], percent: 0 };
                }
                if (resistTypeSkills.length > 1) {
                    console.warn('Multiple Type Resist skills detected. Only using first');
                }
                const [typeBits, percent] = resistTypeSkills[0].skillArgs;
                return {
                    types: common_9.idxsFromBits(typeBits),
                    percent: percent,
                };
            }
            getAttrResists() {
                const resistAttrSkills = this.getEnemySkills(72);
                if (!resistAttrSkills.length) {
                    return { attrs: [], percent: 0 };
                }
                if (resistAttrSkills.length > 1) {
                    console.warn('Multiple Type Resist skills detected. Only using first');
                }
                const [attrBits, percent] = resistAttrSkills[0].skillArgs;
                return {
                    attrs: common_9.idxsFromBits(attrBits),
                    percent: percent,
                };
            }
            getCard() {
                return ilmina_stripped_6.floof.getCard(this.id);
            }
            getAttribute() {
                if (ilmina_stripped_6.floof.hasCard(this.id) && this.currentAttribute == -1) {
                    return ilmina_stripped_6.floof.getCard(this.id).attribute;
                }
                if (ilmina_stripped_6.floof.hasCard(this.id) && this.currentAttribute == -2) {
                    return ilmina_stripped_6.floof.getCard(this.id).subattribute > -1 ? ilmina_stripped_6.floof.getCard(this.id).subattribute : ilmina_stripped_6.floof.getCard(this.id).attribute;
                }
                return this.currentAttribute;
            }
            calcDamage(ping, pings, comboContainer, playerMode, awakeningsEnabled, voids) {
                let currentDamage = ping.damage;
                if (!currentDamage || this.invincible) {
                    return 0;
                }
                // Handle Attribute (dis)advantage
                if (Advantage[ping.attribute] == this.getAttribute()) {
                    currentDamage *= 2;
                }
                else if (Disadvantage[ping.attribute] == this.getAttribute()) {
                    currentDamage = Math.ceil(currentDamage / 2);
                }
                // Handle killers.
                const types = ilmina_stripped_6.floof.getCard(this.id).types;
                if (!ping.isActive && awakeningsEnabled) {
                    let killerCount = 0;
                    let latentCount = 0;
                    for (const type of types) {
                        killerCount += ping.source.countAwakening(common_9.TypeToKiller[type], playerMode);
                        latentCount += ping.source.latents.filter((latent) => latent == common_9.TypeToLatentKiller[type]).length;
                    }
                    currentDamage *= (3 ** killerCount);
                    currentDamage *= (1.5 ** latentCount);
                    currentDamage = Math.min(currentDamage, common_9.INT_CAP);
                }
                if (ping.attribute != common_9.Attribute.FIXED) {
                    // Handle resisted Attributes and Types
                    const attrResists = this.getAttrResists();
                    if (attrResists.attrs.includes(ping.attribute)) {
                        currentDamage *= (100 - attrResists.percent) / 100;
                    }
                    const typeResists = this.getTypeResists();
                    if (ping.source.anyTypes(typeResists.types)) {
                        currentDamage *= (100 - typeResists.percent) / 100;
                    }
                    currentDamage = Math.ceil(currentDamage);
                    // Handle Defense
                    if (!ping.source.countAwakening(common_9.Awakening.GUARD_BREAK) ||
                        new Set(pings.filter((p) => p.damage && p.attribute >= 0 && p.attribute <= 4).map((p) => p.attribute)).size < 5) {
                        currentDamage -= this.getDef();
                        currentDamage = Math.max(currentDamage, 1);
                    }
                    // Handle Shield
                    if (this.shieldPercent) {
                        currentDamage *= (100 - this.shieldPercent) / 100;
                        currentDamage = Math.ceil(currentDamage);
                    }
                }
                // Handle void
                if (this.damageVoid && currentDamage >= this.damageVoid &&
                    !ping.ignoreVoid && !voids.damageVoid &&
                    !(ping.source.latents.some((l) => l == common_9.Latent.RESIST_DAMAGE_VOID)
                        && new Set(pings.filter((p) => p.damage).map((p) => p.attribute)).size == 5
                        && comboContainer.combos['h'].length)) {
                    currentDamage = 0;
                }
                // Handle Absorbs
                if (this.attributeAbsorb.includes(ping.attribute) && !voids.attributeAbsorb &&
                    !(ping.source.latents.some((l) => l == common_9.Latent.RESIST_ATTRIBUTE_ABSORB)
                        && new Set(pings.filter((p) => p.damage && p.attribute >= 0 && p.attribute <= 4).map(p => p.attribute)).size == 5
                        && comboContainer.combos['h'].length)) {
                    currentDamage *= -1;
                }
                else if (this.damageAbsorb && currentDamage >= this.damageAbsorb && !voids.damageAbsorb) {
                    currentDamage *= -1;
                }
                else if (this.comboAbsorb && !ping.isActive && comboContainer.comboCount() <= this.comboAbsorb) {
                    currentDamage *= -1;
                }
                return currentDamage;
            }
            setId(id) {
                if (!ilmina_stripped_6.floof.hasCard(id)) {
                    return;
                }
                this.id = id;
                this.reset();
            }
            getName() {
                if (this.id < 0 || !ilmina_stripped_6.floof.hasCard(this.id)) {
                    return 'UNSET';
                }
                return ilmina_stripped_6.floof.getCard(this.id).name;
            }
            reset( /** idc */) {
                this.currentHp = this.getHp();
                this.currentAttribute = -1;
                this.statusShield = false;
                this.shieldPercent = 0;
                this.attributeAbsorb.length = 0;
                this.comboAbsorb = 0;
                this.damageAbsorb = 0;
                this.damageVoid = 0;
                this.attackMultiplier = 1;
                // this.turnsRemaining = this.turnCounter;
                this.turnCounterOverride = -1;
                this.ignoreDefensePercent = 0;
                this.poison = 0;
                this.delayed = false;
                // Assume that only large monsters are alone.
                this.otherEnemyHp = this.getCard().monsterSize == 5 ? 0 : 100;
                this.charges = ilmina_stripped_6.floof.getCard(this.id).charges;
                this.counter = 0;
                this.flags = 0;
            }
            toJson() {
                const obj = {};
                if (ilmina_stripped_6.floof.hasCard(this.id)) {
                    obj.id = this.id;
                }
                if (this.lv != 10) {
                    obj.lv = this.lv;
                }
                return obj;
            }
            static fromJson(json) {
                const enemy = new EnemyInstance();
                enemy.id = Number(json.id) || -1;
                enemy.lv = Number(json.lv) || 10;
                enemy.reset();
                return enemy;
            }
        }
        exports.EnemyInstance = EnemyInstance;
    });
    define("actives", ["require", "exports", "common", "damage_ping", "ilmina_stripped", "debugger"], function (require, exports, common_10, damage_ping_2, ilmina_stripped_7, debugger_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        // 0
        const scalingAttackToAllEnemies = {
            damage: ([attr, atk100], { source, awakeningsActive, playerMode }) => {
                const ping = new damage_ping_2.DamagePing(source, attr);
                ping.isActive = true;
                ping.damage = source.getAtk(playerMode, awakeningsActive);
                ping.multiply(atk100 / 100, common_10.Round.UP);
                return [ping];
            },
        };
        // 1
        const flatAttackToAllEnemies = {
            damage: ([attr, damage], { source }) => {
                const ping = new damage_ping_2.DamagePing(source, attr);
                ping.isActive = true;
                ping.damage = damage;
                return [ping];
            },
        };
        // 2
        const scalingAttackRandomToSingleEnemy = {
            damage: ([atk100base, atk100max], { source, awakeningsActive, playerMode }) => {
                atk100max = atk100max || atk100base;
                const ping = new damage_ping_2.DamagePing(source, source.getAttribute());
                ping.isActive = true;
                ping.damage = source.getAtk(playerMode, awakeningsActive);
                const multiplier100 = atk100base + Math.floor(Math.random() * (atk100max - atk100base));
                ping.multiply(multiplier100 / 100, common_10.Round.UP);
                if (atk100base != atk100max) {
                    debugger_3.debug.print('Random scaling active used. Damage is inconsistent');
                }
                return [ping];
            },
        };
        // 3
        const shield = {
            teamEffect: ([_, shieldPercent], { team }) => {
                team.state.shieldPercent = shieldPercent;
                team.update();
            },
        };
        // 4
        const poison = {
            enemyEffect: ([poisonMultiplier100], { source, enemy, awakeningsActive, playerMode }) => {
                if (enemy.statusShield) {
                    enemy.poison = 0;
                    return;
                }
                enemy.poison = Math.ceil(source.getAtk(playerMode, awakeningsActive) * poisonMultiplier100 / 100);
            },
        };
        // 5
        const changeTheWorld = {};
        // 6
        const gravity = {
            damage: ([percentGravity], { source, enemy }) => {
                const ping = new damage_ping_2.DamagePing(source, common_10.Attribute.FIXED);
                ping.isActive = true;
                ping.damage = Math.round(enemy.currentHp * percentGravity / 100);
                return [ping];
            },
        };
        // 8
        const flatHeal = {
            teamEffect: ([amount], { team }) => {
                team.heal(amount);
                team.update();
            },
        };
        // 9
        const orbChange = {};
        // 10
        const orbRefresh = {};
        // 18
        const delay = {
            enemyEffect: ([turns], { enemy }) => {
                if (enemy.statusShield) {
                    return;
                }
                enemy.turnsRemaining += turns;
            },
        };
        // 19
        const defenseBreak = {
            enemyEffect: ([_, defenseBreakPercent], { enemy }) => {
                if (enemy.statusShield) {
                    enemy.ignoreDefensePercent = 0;
                    return;
                }
                enemy.ignoreDefensePercent = defenseBreakPercent;
            },
        };
        // 20
        const orbChangeDouble = {};
        function simulateDamage(ping, ctx) {
            return ctx.enemy.calcDamage(ping, [ping], ctx.comboContainer, ctx.team.playerMode, ctx.team.state.awakenings, {
                attributeAbsorb: ctx.team.state.voidAttributeAbsorb,
                damageAbsorb: ctx.team.state.voidDamageAbsorb,
                damageVoid: ctx.team.state.voidDamageVoid,
            });
        }
        // 35
        const scalingAttackAndHeal = {
            damage: ([atk100], ctx) => {
                const baseSkill = scalingAttackToAllEnemies.damage;
                return baseSkill ? baseSkill([ctx.source.getAttribute(), atk100], ctx) : [];
            },
            teamEffect: (params, ctx) => {
                const skill = scalingAttackAndHeal.damage;
                if (!skill)
                    return;
                const ping = skill(params, {
                    source: ctx.source,
                    enemy: ctx.enemy,
                    awakeningsActive: ctx.team.state.awakenings,
                    playerMode: ctx.team.playerMode,
                    team: ctx.team.getActiveTeam(),
                    currentHp: ctx.team.state.currentHp,
                    maxHp: ctx.team.getHp(),
                    badge: ctx.team.badges[ctx.team.activeTeamIdx],
                })[0];
                const healAmount = Math.ceil(simulateDamage(ping, ctx) * params[1] / 100);
                ctx.team.heal(healAmount);
                ctx.team.update();
            },
        };
        // 37
        // Effectively the same as single target.
        const scalingAttackToOneEnemy = scalingAttackToAllEnemies;
        // 42
        const flatAttackToAttribute = {
            damage: ([targetAttr, attackAttr, damage], ctx) => {
                if (ctx.enemy.getAttribute() != targetAttr) {
                    return [];
                }
                const skill = flatAttackToAllEnemies.damage;
                if (!skill)
                    return [];
                return skill([attackAttr, damage], ctx);
            },
        };
        // 50
        const attrOrRcvBurst = {
            teamEffect: ([_, attr, mult100], { team }) => {
                if (attr == 5) {
                    team.state.rcvMult = mult100 / 100;
                }
                else {
                    team.state.burst = {
                        attrRestrictions: [attr],
                        typeRestrictions: [],
                        multiplier: mult100 / 100,
                        awakeningScale: 0,
                        awakenings: [],
                    };
                }
                team.update();
            },
        };
        // 51
        const massAttack = {};
        // 52
        const enhanceOrbs = {};
        // 55
        const fixedDamageToOneEnemy = {
            damage: ([amount], { source }) => {
                const ping = new damage_ping_2.DamagePing(source, common_10.Attribute.FIXED);
                ping.isActive = true;
                ping.damage = amount;
                return [ping];
            },
        };
        // 56
        const fixedDamageToAllEnemies = fixedDamageToOneEnemy;
        // 58
        const scalingAttackRandomToAllEnemies = {
            damage: ([attr, ...args], ctx) => {
                const skill = scalingAttackRandomToSingleEnemy.damage;
                if (!skill) {
                    return [];
                }
                const [ping] = skill(args, ctx);
                ping.attribute = attr;
                return [ping];
            },
        };
        // 59
        const scalingAttackRandomToOneEnemy = scalingAttackRandomToAllEnemies;
        // 71
        const fullBoard = {};
        // 84
        const scalingAttackAndSuicideSingle = {
            damage: ([attr, atk100base, atk100max], ctx) => {
                const skill = scalingAttackRandomToAllEnemies.damage;
                if (!skill)
                    return [];
                return skill([attr, atk100base, atk100max], ctx);
            },
            teamEffect: ([_, _a, _b, suicideTo], { team }) => {
                suicideTo = suicideTo || 0;
                team.state.currentHp = Math.max(1, Math.floor(team.state.currentHp * suicideTo / 100));
                team.update();
            },
        };
        // 85
        const scalingAttackAndSuicideMass = scalingAttackAndSuicideSingle;
        // 86
        const flatAttackAndSuicideSingle = {
            damage: flatAttackToAllEnemies.damage,
            teamEffect: scalingAttackAndSuicideSingle.teamEffect,
        };
        // 87
        const flatAttackAndSuicideMass = flatAttackAndSuicideSingle;
        // 88
        const burstForOneType = {
            teamEffect: ([_, type, mult100], { team }) => {
                team.state.burst = {
                    multiplier: mult100 / 100,
                    typeRestrictions: [type],
                    attrRestrictions: [],
                    awakenings: [],
                    awakeningScale: 0,
                };
                team.update();
            },
        };
        // 90
        const burstForTwoAttributes = {
            teamEffect: ([_, attr1, attr2, mult100], { team }) => {
                team.state.burst = {
                    multiplier: mult100 / 100,
                    typeRestrictions: [],
                    attrRestrictions: [attr1, attr2],
                    awakenings: [],
                    awakeningScale: 0,
                };
                team.update();
            },
        };
        // 92
        const burstForTwoTypes = {
            teamEffect: ([_, type1, type2, mult100], { team }) => {
                team.state.burst = {
                    multiplier: mult100 / 100,
                    typeRestrictions: [type1, type2],
                    attrRestrictions: [],
                    awakenings: [],
                    awakeningScale: 0,
                };
            },
        };
        // 93
        const leadSwap = {
            teamEffect: (_, { team }) => {
                team.updateState({
                    leadSwap: Math.floor(team.action / 2),
                });
            },
        };
        // 110
        const grudgeStrike = {
            damage: ([_, attr, baseMult100, maxMult100, scaling], { source, playerMode, awakeningsActive, currentHp, maxHp }) => {
                const ping = new damage_ping_2.DamagePing(source, attr);
                ping.isActive = true;
                ping.damage = source.getAtk(playerMode, awakeningsActive);
                const multiplierScale100 = (maxMult100 - baseMult100) * ((1 - (currentHp - 1) / maxHp) ** (scaling / 100));
                ping.multiply((baseMult100 + multiplierScale100) / 100, common_10.Round.NEAREST);
                return [ping];
            },
        };
        // 115
        const elementalScalingAttackAndHeal = {
            damage: ([attr, atk100], ctx) => {
                const skill = scalingAttackAndHeal.damage;
                if (!skill)
                    return [];
                const [ping] = skill([atk100], ctx);
                ping.attribute = attr;
                return [ping];
            },
            teamEffect: (params, ctx) => {
                const skill = elementalScalingAttackAndHeal.damage;
                if (!skill)
                    return;
                const ping = skill(params, {
                    source: ctx.source,
                    enemy: ctx.enemy,
                    awakeningsActive: ctx.team.state.awakenings,
                    playerMode: ctx.team.playerMode,
                    team: ctx.team.getActiveTeam(),
                    currentHp: ctx.team.state.currentHp,
                    maxHp: ctx.team.getHp(),
                    badge: ctx.team.badges[ctx.team.activeTeamIdx],
                })[0];
                const healAmount = Math.ceil(simulateDamage(ping, ctx) * params[1] / 100);
                ctx.team.heal(healAmount);
                ctx.team.update();
            },
        };
        // 116 + 138
        const multipleActiveSkills = {
            damage: (activeIds, ctx) => {
                const ret = [];
                return ret.concat(...activeIds.map((id) => damage(id, ctx)));
            },
            teamEffect: (activeIds, ctx) => {
                for (const id of activeIds) {
                    teamEffect(id, ctx);
                }
            },
            enemyEffect: (activeIds, ctx) => {
                for (const id of activeIds) {
                    enemyEffect(id, ctx);
                }
            },
            boardEffect: (activeIds, ctx) => {
                for (const id of activeIds) {
                    boardEffect(id, ctx);
                }
            },
        };
        // 117
        const catchAllCleric = {
            teamEffect: ([bindReduce, rcv100, flatHeal, percentHeal, awokenBindReduce], { source, team }) => {
                let healing = 0;
                if (bindReduce) {
                    for (const monster of team.monsters) {
                        monster.bound = false;
                    }
                }
                if (awokenBindReduce) {
                    team.state.awakenings = true;
                }
                if (flatHeal) {
                    healing += flatHeal;
                }
                if (rcv100) {
                    healing += Math.ceil(source.getRcv(team.playerMode, team.state.awakenings));
                }
                if (percentHeal) {
                    healing += Math.ceil(team.getHp() * percentHeal / 100);
                }
                if (healing) {
                    team.heal(healing);
                }
                team.update();
            },
        };
        // 127
        const orbChangeColumn = {};
        // 132
        const timeExtend = {
            teamEffect: ([_, seconds10, mult100], { team }) => {
                if (mult100) {
                    team.state.timeBonus = mult100 / 100;
                    team.state.timeIsMult = true;
                }
                else {
                    team.state.timeBonus = seconds10 / 10;
                    team.state.timeIsMult = false;
                }
                team.update();
            },
        };
        // 141
        const randomOrbSpawn = {};
        // 142
        const selfAttributeChange = {
            teamEffect: ([_, attr], { source, team }) => {
                source.attribute = attr;
                team.update();
            },
        };
        // 144
        const scalingAttackFromTeam = {
            damage: ([attrBits, atk100, _, attr], { source, playerMode, awakeningsActive, team, badge }) => {
                const ping = new damage_ping_2.DamagePing(source, attr);
                ping.isActive = true;
                const attrs = new Set(common_10.idxsFromBits(attrBits));
                for (const m of team) {
                    const atk = m.getAtk(playerMode, awakeningsActive);
                    if (attrs.has(m.getAttribute())) {
                        ping.add(atk);
                    }
                    if (attrs.has(m.getSubattribute())) {
                        if (m.getAttribute() == m.getSubattribute()) {
                            ping.add(Math.ceil(atk / 10));
                        }
                        else {
                            ping.add(Math.ceil(atk / 3));
                        }
                    }
                }
                ping.multiply(atk100 / 100, common_10.Round.UP);
                if (badge == common_10.TeamBadge.ATK) {
                    ping.multiply(1.05, common_10.Round.UP);
                }
                else if (badge == common_10.TeamBadge.ATK_PLUS) {
                    ping.multiply(1.15, common_10.Round.UP);
                }
                return [ping];
            },
        };
        // 146
        const haste = {};
        // 153
        const enemyAttributeChange = {
            enemyEffect: ([attr], { enemy }) => {
                enemy.currentAttribute = attr;
            },
        };
        // 156
        const effectFromAwakeningCount = {
            teamEffect: ([_, awakening1, awakening2, awakening3, effect, mult100], { team }) => {
                const awakenings = [awakening1, awakening2, awakening3].filter(Boolean);
                const count = awakenings.map((a) => team.countAwakening(a)).reduce((t, a) => t + a, 0);
                if (effect == 1) {
                    const healing = Math.ceil(mult100 * count);
                    team.heal(healing);
                }
                else if (effect == 2) {
                    mult100 -= 100;
                    team.state.burst = {
                        awakenings: awakenings,
                        awakeningScale: mult100 / 100,
                        multiplier: 1,
                        typeRestrictions: [],
                        attrRestrictions: [],
                    };
                }
                else if (effect == 3) {
                    const shieldPercent = Math.min(100, count * mult100);
                    team.state.shieldPercent = shieldPercent;
                }
                team.update();
            },
        };
        // 160
        const addCombos = {
            boardEffect: ([_, combos], comboContainer) => {
                comboContainer.bonusCombosActive = combos;
            },
        };
        // 161
        const trueGravity = {
            damage: ([percentGravity], { source, enemy }) => {
                const ping = new damage_ping_2.DamagePing(source, common_10.Attribute.FIXED);
                ping.isActive = true;
                ping.damage = Math.ceil(enemy.getHp() * percentGravity / 100);
                return [ping];
            },
        };
        // 168
        const burstFromAwakeningCount = {
            teamEffect: ([_turns, awakening1, awakening2, awakening3, awakening4, awakening5, awakening6, mult100], { team }) => {
                const awakenings = [awakening1, awakening2, awakening3, awakening4, awakening5, awakening6].filter(Boolean);
                team.state.burst = {
                    awakenings,
                    awakeningScale: mult100 / 100,
                    multiplier: 1,
                    typeRestrictions: [],
                    attrRestrictions: [],
                };
                team.update();
            },
        };
        // 173
        const voidAbsorb = {
            teamEffect: ([_, includeAttribute, _a, includeDamage], { team }) => {
                team.state.voidAttributeAbsorb = team.state.voidAttributeAbsorb || Boolean(includeAttribute);
                team.state.voidDamageAbsorb = team.state.voidDamageAbsorb || Boolean(includeDamage);
                team.update();
            },
        };
        // 184
        const noSkyfall = {};
        // 191
        const voidDamageVoid = {
            teamEffect: (_, { team }) => {
                team.state.voidDamageVoid = true;
                team.update();
            },
        };
        // 195
        const pureSuicide = {
            teamEffect: ([suicideTo], { team }) => {
                team.state.currentHp = Math.max(1, Math.floor(team.state.currentHp * suicideTo / 100));
                team.update();
            },
        };
        // 202
        const transform = {
            teamEffect: ([id], { source, team }) => {
                source.transformedTo = id;
                team.update();
            },
        };
        const ACTIVE_GENERATORS = {
            0: scalingAttackToAllEnemies,
            1: flatAttackToAllEnemies,
            2: scalingAttackRandomToSingleEnemy,
            3: shield,
            4: poison,
            5: changeTheWorld,
            6: gravity,
            8: flatHeal,
            9: orbChange,
            10: orbRefresh,
            18: delay,
            19: defenseBreak,
            20: orbChangeDouble,
            35: scalingAttackAndHeal,
            37: scalingAttackToOneEnemy,
            42: flatAttackToAttribute,
            50: attrOrRcvBurst,
            51: massAttack,
            52: enhanceOrbs,
            55: fixedDamageToOneEnemy,
            56: fixedDamageToAllEnemies,
            58: scalingAttackRandomToAllEnemies,
            59: scalingAttackRandomToOneEnemy,
            71: fullBoard,
            84: scalingAttackAndSuicideSingle,
            85: scalingAttackAndSuicideMass,
            86: flatAttackAndSuicideSingle,
            87: flatAttackAndSuicideMass,
            88: burstForOneType,
            90: burstForTwoAttributes,
            92: burstForTwoTypes,
            93: leadSwap,
            110: grudgeStrike,
            115: elementalScalingAttackAndHeal,
            116: multipleActiveSkills,
            117: catchAllCleric,
            127: orbChangeColumn,
            132: timeExtend,
            138: multipleActiveSkills,
            141: randomOrbSpawn,
            142: selfAttributeChange,
            144: scalingAttackFromTeam,
            146: haste,
            153: enemyAttributeChange,
            156: effectFromAwakeningCount,
            160: addCombos,
            161: trueGravity,
            168: burstFromAwakeningCount,
            173: voidAbsorb,
            184: noSkyfall,
            188: fixedDamageToOneEnemy,
            191: voidDamageVoid,
            195: pureSuicide,
            202: transform,
        };
        function getGeneratorIfExists(activeId) {
            if (!ilmina_stripped_7.floof.getPlayerSkill(activeId)) {
                debugger_3.debug.print(`Active ID not found: ${activeId}`);
                return;
            }
            const active = ilmina_stripped_7.floof.getPlayerSkill(activeId);
            const generator = ACTIVE_GENERATORS[active.internalEffectId];
            if (!generator) {
                debugger_3.debug.print(`Active Internal Effect ${active.internalEffectId} not implemented`);
                return;
            }
            return generator;
        }
        function damage(activeId, ctx) {
            const generator = getGeneratorIfExists(activeId);
            if (!generator || !generator.damage) {
                return [];
            }
            return generator.damage(ilmina_stripped_7.floof.getPlayerSkill(activeId).internalEffectArguments, ctx);
        }
        exports.damage = damage;
        function teamEffect(activeId, ctx) {
            const generator = getGeneratorIfExists(activeId);
            if (!generator || !generator.teamEffect) {
                return;
            }
            return generator.teamEffect(ilmina_stripped_7.floof.getPlayerSkill(activeId).internalEffectArguments, ctx);
        }
        exports.teamEffect = teamEffect;
        function enemyEffect(activeId, ctx) {
            const generator = getGeneratorIfExists(activeId);
            if (!generator || !generator.enemyEffect) {
                return;
            }
            return generator.enemyEffect(ilmina_stripped_7.floof.getPlayerSkill(activeId).internalEffectArguments, ctx);
        }
        exports.enemyEffect = enemyEffect;
        function boardEffect(activeId, ctx) {
            const generator = getGeneratorIfExists(activeId);
            if (!generator || !generator.boardEffect) {
                return;
            }
            return generator.boardEffect(ilmina_stripped_7.floof.getPlayerSkill(activeId).internalEffectArguments, ctx);
        }
        exports.boardEffect = boardEffect;
    });
    /**
     * Custom Base 64 encoding for Valeria's teams. This uses the 64 available
     * characaters
     * Encoding is as follows:
     * 6 bits to determine encoding version.
    
     * Encoding version 0:
     * 2 bits to determine player mode (1 = 1P, 2 = 2p, 3 = 3p)
     * For each team in mode:
     *   5 bits to encode team badge.
     *   If mode is 1P or 3P: Repeat the following 6 times. Else 5 times
     *     14 bits encode monster sub id.
     *     If monster id is 0, there is no monster here. Go to next monster sub.
     *     Else:
     *       Next 14 bits is monster inherit.
     *       If inherit id is 0, this monster has no inherit, go to monster stats.
     *       Else:
     *         Next 7 bits represents inherit level.
     *         Next 1 bit represents if the inherit monster is +297.
     *       Next 4 bits determine number of Latents
     *       For each latent:
     *         Next 6 bits represents latent.
     *       Next 7 bits represents monster level.
     *       Next 4 bits represents monster awakening level.
     *       Next 1 bit represents if a monster is 297 or not.
     *       If 297, set to 297
     *       Else:
     *         Next 7 bits represents +HP
     *         Next 7 bits represents +ATK
     *         Next 7 bits represents +RCV
     *       Next 4 bits represents monsters Super Awakening.
     */
    define("custom_base64", ["require", "exports", "monster_instance"], function (require, exports, monster_instance_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        // Any changes to the encoding schema should be noted here by incrementing this.
        const ENCODING_VERSION = 0;
        var Bits;
        (function (Bits) {
            Bits[Bits["VERSION"] = 6] = "VERSION";
            Bits[Bits["PLAYER_MODE"] = 2] = "PLAYER_MODE";
            Bits[Bits["BADGE"] = 5] = "BADGE";
            Bits[Bits["ID"] = 14] = "ID";
            Bits[Bits["LEVEL"] = 7] = "LEVEL";
            Bits[Bits["LATENT_COUNT"] = 4] = "LATENT_COUNT";
            Bits[Bits["LATENT"] = 6] = "LATENT";
            Bits[Bits["AWAKENING"] = 4] = "AWAKENING";
            Bits[Bits["PLUS"] = 7] = "PLUS";
        })(Bits || (Bits = {}));
        const CHAR_AT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const CHAR_TO_NUM = new Map(CHAR_AT.split('').map((c, i) => [c, i]));
        class Encoding {
            constructor(s = '') {
                this.bitQueue = 0;
                this.queueLength = 0;
                this.dequeueLength = 0;
                this.bitDequeue = 0;
                this.composedString = s;
            }
            check() {
                while (this.queueLength >= 6) {
                    this.queueLength -= 6;
                    this.composedString += CHAR_AT[this.bitQueue >> this.queueLength];
                    this.bitQueue = this.bitQueue & ((1 << this.queueLength) - 1);
                }
            }
            queueBits(n, l) {
                if ((1 << l) <= n) {
                    throw new Error(`Cannot queue a number ${n} of length ${l}`);
                }
                this.bitQueue = (this.bitQueue << l) | n;
                this.queueLength += l;
                this.check();
            }
            queueBit(on) {
                this.queueLength++;
                this.bitQueue = this.bitQueue << 1 | Number(on);
                this.check();
            }
            dequeueBit() {
                if (!this.dequeueLength) {
                    this.dequeueLength = 6;
                    this.bitDequeue = CHAR_TO_NUM.get(this.composedString[0]);
                    this.composedString = this.composedString.substring(1);
                }
                this.dequeueLength--;
                const val = this.bitDequeue >> this.dequeueLength;
                this.bitDequeue = this.bitDequeue & ((1 << this.dequeueLength) - 1);
                return val;
            }
            dequeueBits(l) {
                let result = 0;
                for (let i = 0; i < l; i++) {
                    result = (result << 1) | this.dequeueBit();
                }
                return result;
            }
            getString() {
                const padded = this.bitQueue << (6 - this.queueLength);
                return this.composedString + CHAR_AT[padded];
            }
        }
        exports.Encoding = Encoding;
        function ValeriaEncode(team) {
            const encoding = new Encoding();
            encoding.queueBits(ENCODING_VERSION, Bits.VERSION);
            const playerMode = team.playerMode;
            encoding.queueBits(playerMode, Bits.PLAYER_MODE);
            const monstersPerTeam = playerMode == 2 ? 5 : 6;
            for (let i = 0; i < playerMode; i++) {
                encoding.queueBits(team.badges[i], Bits.BADGE);
                for (let j = 0; j < monstersPerTeam; j++) {
                    const monster = team.monsters[i * 6 + j];
                    const id = monster.getId(true);
                    if (id <= 0) {
                        encoding.queueBits(0, Bits.ID);
                        continue;
                    }
                    encoding.queueBits(id, Bits.ID);
                    const inheritId = monster.inheritId;
                    if (inheritId <= 0) {
                        encoding.queueBits(0, Bits.ID);
                    }
                    else {
                        encoding.queueBits(inheritId, Bits.ID);
                        encoding.queueBits(monster.inheritLevel, Bits.LEVEL);
                        encoding.queueBit(monster.inheritPlussed);
                    }
                    encoding.queueBits(monster.latents.length, Bits.LATENT_COUNT);
                    for (const latent of monster.latents) {
                        encoding.queueBits(latent, Bits.LATENT);
                    }
                    encoding.queueBits(monster.level, Bits.LEVEL);
                    encoding.queueBits(monster.awakenings, Bits.AWAKENING);
                    if (monster.hpPlus + monster.atkPlus + monster.rcvPlus == 297) {
                        encoding.queueBit(true);
                    }
                    else {
                        encoding.queueBit(false);
                        encoding.queueBits(monster.hpPlus, Bits.PLUS);
                        encoding.queueBits(monster.atkPlus, Bits.PLUS);
                        encoding.queueBits(monster.rcvPlus, Bits.PLUS);
                    }
                    encoding.queueBits(monster.superAwakeningIdx + 1, Bits.AWAKENING);
                }
            }
            return encoding.getString();
        }
        exports.ValeriaEncode = ValeriaEncode;
        // All decoding methods starting from the first VERSION. When adding new ones,
        // add to the TOP of this, so that it's clear which one is the most recent.
        const DecodingVersions = {
            0: (encoding) => {
                let pdchu = '';
                let badges = [0, 0, 0];
                const playerMode = encoding.dequeueBits(2);
                const monstersPerTeam = playerMode == 2 ? 5 : 6;
                for (let i = 0; i < playerMode; i++) {
                    badges[i] = encoding.dequeueBits(Bits.BADGE);
                    let teamString = '';
                    for (let j = 0; j < monstersPerTeam; j++) {
                        const id = encoding.dequeueBits(Bits.ID);
                        if (id == 0) {
                            teamString += ' / ';
                            continue;
                        }
                        teamString += `${id} `;
                        const inheritId = encoding.dequeueBits(Bits.ID);
                        if (inheritId != 0) {
                            teamString += `(${inheritId}| lv${encoding.dequeueBits(Bits.LEVEL)}${encoding.dequeueBit() ? ' +297' : ''})`;
                        }
                        const latentCount = encoding.dequeueBits(Bits.LATENT_COUNT);
                        if (latentCount) {
                            teamString += '[';
                            for (let k = 0; k < latentCount; k++) {
                                teamString += `${monster_instance_2.LatentToPdchu.get(encoding.dequeueBits(Bits.LATENT))},`;
                            }
                            teamString = teamString.substring(0, teamString.length - 1);
                            teamString += '] ';
                        }
                        teamString += `| lv${encoding.dequeueBits(Bits.LEVEL)} awk${encoding.dequeueBits(Bits.AWAKENING)} `;
                        const is297 = encoding.dequeueBit();
                        if (!is297) {
                            teamString += `+H${encoding.dequeueBits(Bits.PLUS)} +A${encoding.dequeueBits(Bits.PLUS)} +R${encoding.dequeueBits(Bits.PLUS)} `;
                        }
                        const sa = encoding.dequeueBits(Bits.AWAKENING);
                        if (sa) {
                            teamString += `sa${sa} `;
                        }
                        teamString += '/ ';
                    }
                    pdchu += teamString.substring(0, teamString.length - 2) + '; ';
                }
                return {
                    pdchu: pdchu.substring(0, pdchu.length - 2),
                    badges,
                };
            },
        };
        function ValeriaDecodeToPdchu(s) {
            const encoding = new Encoding(s);
            const v = encoding.dequeueBits(Bits.VERSION);
            const decoder = DecodingVersions[v];
            if (decoder) {
                return decoder(encoding);
            }
            // Fallback to version 0.
            // This only becomes an issue if we have >= (1 << 4) versions, at which point
            // I will safely assume that we do not need them anymore. (16 encoding
            // updates is pretty big.)
            return DecodingVersions[0](new Encoding(s));
        }
        exports.ValeriaDecodeToPdchu = ValeriaDecodeToPdchu;
    });
    define("enemy_skills", ["require", "exports", "ilmina_stripped", "common", "debugger"], function (require, exports, ilmina_stripped_8, common_11, debugger_4) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var SkillType;
        (function (SkillType) {
            SkillType[SkillType["EFFECT"] = 0] = "EFFECT";
            SkillType[SkillType["LOGIC"] = 1] = "LOGIC";
            SkillType[SkillType["PASSIVE"] = 2] = "PASSIVE";
        })(SkillType || (SkillType = {}));
        const TO_NEXT = -1;
        const TERMINATE = 0;
        function range(begin, end, singular = ' turn', plural = ' turns') {
            begin = begin || 0;
            const suffix = ' ' + (end == 1 ? singular : plural);
            if (begin == end) {
                return common_11.addCommas(end) + suffix;
            }
            return `${common_11.addCommas(begin)}-${common_11.addCommas(end)}${suffix}`;
        }
        // 1
        const bindRandom = {
            textify: ({ skillArgs, aiArgs }, { atk }) => {
                const [count, min, max] = skillArgs;
                return `Binds ${count} of all monsters for ${range(min, max)}${aiArgs[4] ? ` and hits for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))})` : ''}.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ aiArgs }, { team, enemy, comboContainer }) => {
                // let [count, min, max] = skillArgs;
                console.warn('Bind not yet supported');
                // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
                if (aiArgs[4]) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { atk, aiArgs }) => {
                if (aiArgs[4]) {
                    mechanic.hits.push(Math.ceil(aiArgs[4] * atk / 100));
                }
                mechanic.leaderBind = true;
                mechanic.helperBind = true;
                mechanic.subBind = true;
            },
        };
        // 2
        const bindAttr = {
            textify: ({ skillArgs, aiArgs }, { atk }) => {
                const [color, min, max] = skillArgs;
                return `Binds ${common_11.AttributeToName.get(color || 0)} monsters for ${range(min, max)}${aiArgs[4] ? ` and hits for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))})` : ''}. If none exist and part of skillset, hits for ${common_11.addCommas(atk)}. Else continue.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs, aiArgs }, { team, enemy, comboContainer }) => {
                const a = skillArgs[0];
                if (team.getActiveTeam().every((m) => !m.isAttribute(a))) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                    return;
                }
                console.warn('Bind not yet supported');
                // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
                if (aiArgs[4]) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                }
            },
            goto: ({ skillArgs }, { teamAttributes }) => teamAttributes.has(skillArgs[0] || 0) ? TERMINATE : TO_NEXT,
            addMechanic: (mechanic, { atk, aiArgs }) => {
                if (aiArgs[4]) {
                    mechanic.hits.push(Math.ceil(aiArgs[4] * atk / 100));
                }
                mechanic.leaderBind = true;
                mechanic.helperBind = true;
                mechanic.subBind = true;
            },
        };
        // 3
        const bindType = {
            textify: ({ skillArgs, aiArgs }, { atk }) => {
                const [type, min, max] = skillArgs;
                return `Binds ${common_11.TypeToName.get(type)} monsters for ${range(min, max)}${aiArgs[4] ? ` and hits for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))})` : ''}. If none exist, hits for ${common_11.addCommas(atk)}.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs, aiArgs }, { enemy, team, comboContainer }) => {
                const t = skillArgs[0];
                if (team.getActiveTeam().every((m) => !m.isType(t))) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                    return;
                }
                console.warn('Bind not yet supported');
                // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
                if (aiArgs[4]) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                }
            },
            goto: ({ skillArgs }, { teamTypes }) => teamTypes.has(skillArgs[0] || 0) ? TERMINATE : TO_NEXT,
            addMechanic: (mechanic, { aiArgs, atk }) => {
                if (aiArgs[4]) {
                    mechanic.hits.push(Math.ceil(aiArgs[4] * atk / 100));
                }
                mechanic.leaderBind = true;
                mechanic.helperBind = true;
                mechanic.subBind = true;
            },
        };
        // 4
        const orbChange = {
            textify: ({ skillArgs }) => `Convert ${common_11.AttributeToName.get(skillArgs[0] || 0)} to ${common_11.AttributeToName.get(skillArgs[1])}. If none exists, Continue.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            // TODO: Change this to TO_NEXT if there are no convertible orbs.
            goto: () => TERMINATE,
        };
        // 5
        const blindBoard = {
            textify: () => 'Blind board.',
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.blind = true;
            },
        };
        // 6
        const dispelBuffs = {
            textify: () => 'Dispel player buffs',
            condition: () => true,
            aiEffect: () => { },
            effect: (_, { team }) => {
                team.resetState();
            },
            goto: () => TERMINATE,
        };
        // 7
        const healOrAttack = {
            textify: ({ skillArgs }, { atk }) => `If player health less than ${common_11.addCommas(atk)}, deal ${common_11.addCommas(atk)}, otherwise heal for ${range(skillArgs[0], skillArgs[1], '', '')}%`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                if (team.state.currentHp <= enemy.getAtk()) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                    return;
                }
                const [min, max] = skillArgs;
                const healAmount = Math.ceil((Math.random() * (max - min) + min) * enemy.getHp() / 100);
                if (enemy.currentHp + healAmount > enemy.getHp()) {
                    enemy.currentHp = enemy.getHp();
                }
                else {
                    enemy.currentHp += healAmount;
                }
            },
            goto: () => TERMINATE,
        };
        // 8
        const enhanceBasicAttack = {
            textify: ({ skillArgs }) => `Force next move to be a ${range(skillArgs[0] + 100, skillArgs[1] + 100, '', '')}% basic attack`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                const [min, max] = skillArgs;
                const enhance = Math.ceil(Math.random() * (max - min)) + min;
                enemy.attackMultiplier = enhance / 100 + 1;
                enemy.forceAttack = true;
            },
            goto: () => TERMINATE,
        };
        // 12
        const singleOrbToJammer = {
            textify: ({ skillArgs }) => `Convert ${skillArgs[0] == -1 ? 'Random' : common_11.AttributeToName.get(skillArgs[0])} color into Jammer.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.jammerChange = true;
            },
        };
        // 13
        const multiOrbToJammer = {
            textify: ({ skillArgs }) => `Randomly convert ${skillArgs[0]} colors into Jammer`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.jammerChange = true;
            },
        };
        // 14
        const skillBind = {
            textify: ({ skillArgs }) => `Skill bind for ${range(skillArgs[0], skillArgs[1])}.`,
            condition: () => true,
            aiEffect: () => { },
            effect: (_, { team }) => {
                team.skillBind();
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.skillBind = true;
            },
        };
        // 15
        const multihit = {
            textify: ({ skillArgs }, { atk }) => {
                const [min, max, percent] = skillArgs;
                if (min == max) {
                    return `Hit ${max}x${percent}% for ${common_11.addCommas(max * Math.ceil(percent / 100 * atk))}`;
                }
                return `Hit ${min}-${max}x${percent}% for ${common_11.addCommas(min * Math.ceil(percent / 100 * atk))}-${common_11.addCommas(max * Math.ceil(percent / 100 * atk))}`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy, team, comboContainer }) => {
                const [min, max, percent] = skillArgs;
                const hitTimes = Math.floor(Math.random() * (max - min)) + min;
                const damage = Math.ceil(percent / 100 * enemy.getAtk());
                for (let i = 0; i < hitTimes; i++) {
                    team.damage(damage, enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { atk, skillArgs }) => {
                for (let i = 0; i < skillArgs[1]; i++) {
                    mechanic.hits.push(Math.ceil(skillArgs[2] * atk / 100));
                }
            },
        };
        // 17
        const enrage = {
            textify: ({ skillArgs }) => {
                return `Attack set to ${skillArgs[2]}% for ${skillArgs[1]} when alone.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                enemy.attackMultiplier = skillArgs[2] / 100;
            },
            goto: (_, { otherEnemyHp }) => otherEnemyHp == 0 ? TERMINATE : TO_NEXT,
        };
        // 18
        const enrageFromStatusAilment = {
            textify: ({ skillArgs }) => {
                return `Attack set to ${skillArgs[1]}% for ${skillArgs[0]} turns when afflicted with status ailment.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                enemy.attackMultiplier = skillArgs[1] / 100;
            },
            goto: () => {
                // TODO: Determine if monster already buffed or monster afflicted with status.
                // return TERMINATE;
                return TO_NEXT;
            },
        };
        // 17
        const enrageFromMinimumAttacks = {
            textify: ({ skillArgs }) => {
                return `Attack set to ${skillArgs[2]}% for ${skillArgs[1]} after ${skillArgs[0]} turns. Unclear`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                enemy.attackMultiplier = skillArgs[2] / 100;
            },
            goto: () => {
                // TODO: Determine if monster already buffed and if condition has happened.
                return TERMINATE;
            },
        };
        // 20
        const statusShield = {
            textify: ({ skillArgs, aiArgs }, { atk }) => `Void status ailments for ${skillArgs[0]} turns` + (aiArgs[4] ? ` and hit for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))})` : ''),
            condition: () => true,
            aiEffect: () => { },
            effect: ({ aiArgs }, { enemy, team, comboContainer }) => {
                enemy.statusShield = true;
                enemy.poison = 0;
                enemy.delayed = false;
                enemy.ignoreDefensePercent = 0;
                if (aiArgs[4]) {
                    team.damage(Math.ceil(enemy.getAtk() * aiArgs[4] / 100), enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanics, { aiArgs, atk }) => {
                if (aiArgs[4]) {
                    mechanics.hits.push(Math.ceil(atk * aiArgs[4] / 100));
                }
            }
        };
        // 22
        const setFlagAndContinue = {
            textify: (skillCtx) => {
                const flagPositions = common_11.idxsFromBits(skillCtx.ai);
                return `Set Flag(s) ${flagPositions} and Continue.`;
            },
            condition: () => true,
            aiEffect: (skillCtx, ctx) => {
                ctx.flags |= skillCtx.ai;
            },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 23
        const goto0IndexIfFlag = {
            textify: ({ ai, rnd }) => {
                return `If Flag ${common_11.idxsFromBits(ai)}, go to skill at index ${rnd - 1}`;
            },
            condition: ({ ai }, { flags }) => {
                return Boolean(flags & ai);
            },
            aiEffect: () => { },
            effect: () => { },
            goto: (skillCtx, ctx) => {
                return gotoIfFlag.condition(skillCtx, ctx) ? skillCtx.rnd : TO_NEXT;
            },
            type: SkillType.LOGIC,
        };
        // 24
        const unsetFlagAndContinue = {
            textify: (skillCtx) => {
                const flagPositions = common_11.idxsFromBits(skillCtx.ai);
                return `Unset Flag(s) ${flagPositions} and Continue.`;
            },
            condition: () => true,
            aiEffect: (skillCtx, ctx) => {
                ctx.flags &= ~skillCtx.ai;
            },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 25
        const setCounterToAiAndContinue = {
            textify: ({ ai }) => `Set counter to ${ai} and Continue.`,
            condition: () => true,
            aiEffect: ({ ai }, ctx) => {
                ctx.counter = ai;
            },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 26
        const incrementCounterAndContinue = {
            textify: () => `Increment counter and continue`,
            condition: () => true,
            aiEffect: (_, ctx) => {
                ctx.counter++;
            },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 27
        const decrementCounterAndContinue = {
            textify: () => `Decrement counter and continue`,
            condition: () => true,
            aiEffect: (_, ctx) => {
                ctx.counter--;
            },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 28
        const gotoIfHpBelow = {
            textify: ({ ai, rnd }) => `If HP <= ${ai}%, go to skill ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { hpPercent }) => hpPercent < ai ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 29
        const gotoIfHpAbove = {
            textify: ({ ai, rnd }) => `If HP >= ${ai}, go to skill ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { hpPercent }) => hpPercent >= ai ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 30
        const gotoIfCounterLesser = {
            textify: ({ ai, rnd }) => `If counter < ${ai}, go to skillset ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { counter }) => counter <= ai ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 31
        const gotoIfCounterEqual = {
            textify: ({ ai, rnd }) => `If counter = ${ai}, go to skillset ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { counter }) => counter == ai ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 32
        const gotoIfCounterGreater = {
            textify: ({ ai, rnd }) => `If counter >= ${ai}, go to skillset ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { counter }) => counter >= ai ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 33
        const gotoIfLvLesser = {
            textify: ({ ai, rnd }) => `If enemy level <${ai}, go to skill at ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { lv }) => lv < ai ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 34
        const gotoIfLvEqual = {
            textify: ({ ai, rnd }) => `If enemy level is ${ai}, go to skill at ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { lv }) => lv == ai ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 35
        const gotoIfLvGreater = {
            textify: ({ ai, rnd }) => `If enemy level >${ai}, go to skill at ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { lv }) => lv > ai ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 36
        const fallbackAttack = {
            textify: (_, { atk }) => {
                return `Attack of ${common_11.addCommas(atk)} used if none of the above are available.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: (_, { team, enemy, comboContainer }) => {
                team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { atk }) => {
                mechanic.hits.push(atk);
            },
        };
        // 37
        const displayCounterOrContinue = {
            textify: () => 'Decrement counter by 1. If positive, display and terminate, else if 0, continue.',
            condition: () => true,
            aiEffect: (_, ctx) => {
                ctx.counter--;
            },
            effect: (_, { enemy }) => {
                if (enemy.counter) {
                    console.log(`Countdown: ${enemy.counter}`);
                }
            },
            goto: (_, { counter }) => {
                return counter > 0 ? TERMINATE : TO_NEXT;
            },
            type: SkillType.LOGIC,
        };
        // 38
        const setCounterAndContinue = {
            textify: ({ rnd }) => `If counter = 0, set counter to ${rnd}`,
            condition: () => true,
            aiEffect: ({ rnd }, ctx) => {
                if (!ctx.counter) {
                    ctx.counter = rnd;
                }
            },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 39
        const timeDebuff = {
            textify: ({ skillArgs }) => {
                const [turns, flatDebuff, timePercent] = skillArgs;
                if (flatDebuff) {
                    if (flatDebuff > 0) {
                        return `Reduce time by ${flatDebuff / 10}s for ${turns} turns`;
                    }
                    else {
                        return `Increase time by ${flatDebuff / -10}s for ${turns} turns`;
                    }
                }
                return `Time set to ${timePercent}% for ${turns} turns`;
            },
            // Determine if already debuffed by opponent?!
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team }) => {
                const [flatDebuff, timePercent] = skillArgs.slice(1);
                team.state.timeBonus = flatDebuff ? flatDebuff / -10 : timePercent / 100;
                team.state.timeIsMult = !flatDebuff;
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.timeDebuff = true;
            },
        };
        // 40
        const suicide = {
            textify: () => `Set own health to 0.`,
            condition: () => true,
            aiEffect: () => { },
            effect: (_, { enemy }) => {
                enemy.currentHp = 0;
            },
            // Currently never occurs in simulations.
            goto: () => TERMINATE,
        };
        // 43
        const gotoIfFlag = {
            textify: ({ ai, rnd }) => {
                return `If Flag ${common_11.idxsFromBits(ai)}, go to skill at index ${rnd}`;
            },
            condition: ({ ai }, { flags }) => {
                return Boolean(flags & ai);
            },
            aiEffect: () => { },
            effect: () => { },
            goto: (skillCtx, ctx) => {
                return gotoIfFlag.condition(skillCtx, ctx) ? skillCtx.rnd - 1 : TO_NEXT;
            },
            type: SkillType.LOGIC,
        };
        // 44
        const orFlagsAndContinue = {
            textify: ({ ai }) => {
                return `OR flags ${common_11.idxsFromBits(ai)}, and Continue.`;
            },
            condition: () => true,
            aiEffect: ({ ai }, ctx) => {
                ctx.flags |= ai;
            },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 45
        const toggleFlagsAndContinue = {
            textify: ({ ai }) => {
                return `Toggle flags ${common_11.idxsFromBits(ai)}, and Continue.`;
            },
            condition: ({ ai }, { flags }) => {
                return Boolean(flags & ai);
            },
            aiEffect: ({ ai }, ctx) => {
                ctx.flags ^= ai;
            },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 46
        const changeAttribute = {
            textify: ({ skillArgs }) => {
                if (!skillArgs.length) {
                    skillArgs.push(0);
                }
                if (!skillArgs.every(Boolean)) {
                    skillArgs = skillArgs.filter(Boolean);
                    skillArgs.push(0);
                }
                const attrs = [...(new Set(skillArgs))].map(i => common_11.AttributeToName.get(i)).join(',');
                return `Change attribute to one of [${attrs}]`;
            },
            condition: (skillCtx, ctx) => {
                return ctx.attribute != skillCtx.skillArgs[0];
            },
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                if (!skillArgs.length) {
                    skillArgs.push(0);
                }
                if (!skillArgs.every(Boolean)) {
                    skillArgs = skillArgs.filter(Boolean);
                    skillArgs.push(0);
                }
                const available = skillArgs.filter((c) => c != enemy.getAttribute());
                enemy.currentAttribute = available[Math.floor(Math.random() * available.length)];
            },
            goto: () => TERMINATE,
        };
        // 47
        const oldPreemptiveAttack = {
            textify: ({ skillArgs }, { atk }) => {
                return `Preemptive: Do ${skillArgs[1]}% (${common_11.addCommas(Math.ceil(skillArgs[1] / 100 * atk))})`;
            },
            condition: () => true,
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                team.damage(Math.ceil(enemy.getAtk() * skillArgs[1] / 100), enemy.getAttribute(), comboContainer);
            },
            aiEffect: () => { },
            goto: (_, ctx) => ctx.isPreempt ? TERMINATE : TO_NEXT,
            addMechanic: (mechanic, { atk, skillArgs }) => {
                mechanic.hits.push(Math.ceil(atk * skillArgs[1] / 100));
            },
        };
        // 48
        const attackAndSingleOrbChange = {
            textify: ({ skillArgs }, { atk }) => {
                const [percent, from, to] = skillArgs;
                const damage = common_11.addCommas(Math.ceil(percent / 100 * atk));
                const fromString = from == -1 ? 'Random Color' : common_11.AttributeToName.get(from);
                const toString = to == -1 ? 'Random Color' : common_11.AttributeToName.get(to);
                return `Hit for ${skillArgs[0]}% (${damage}) and convert ${fromString} to ${toString}`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                team.damage(Math.ceil(skillArgs[0] * enemy.getAtk() / 100), enemy.getAttribute(), comboContainer);
                // Convert orbs?!
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { atk, skillArgs }) => {
                mechanic.hits.push(Math.ceil(atk * skillArgs[0] / 100));
            },
        };
        // 49
        const preemptiveMarker = {
            condition: (skillCtx, conditionContext) => {
                return conditionContext.lv >= skillCtx.skillArgs[0];
            },
            effect: () => { },
            aiEffect: () => { },
            textify: ({ skillArgs }) => {
                return `Preemptive: If level at least ${skillArgs[0]}, do next skillset.`;
            },
            goto: (skillCtx, ctx) => {
                if (!ctx.isPreempt || preemptiveMarker.condition(skillCtx, ctx)) {
                    return TO_NEXT;
                }
                return TERMINATE;
            },
            type: SkillType.LOGIC,
        };
        // 50
        const gravity = {
            textify: ({ skillArgs }) => `${skillArgs[0]}% gravity of player's current health (rounded down)`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                team.damage(Math.floor(team.state.currentHp * skillArgs[0] / 100), enemy.getAttribute(), comboContainer);
                team.update();
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                mechanic.hits.push(`${skillArgs[0]}%`);
            },
        };
        // 52
        const resurrect = {
            textify: ({ skillArgs }) => `Revive ally with ${skillArgs[0]}% HP. If not alone, Continue`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                enemy.otherEnemyHp = skillArgs[0];
            },
            // Currently never occurs in simulations.
            goto: (_, { otherEnemyHp }) => otherEnemyHp ? TO_NEXT : TERMINATE,
        };
        // 53
        const attributeAbsorb = {
            textify: ({ skillArgs }) => {
                const [minTurns, maxTurns, attrIdxs] = skillArgs;
                const attrs = common_11.idxsFromBits(attrIdxs).map((c) => common_11.AttributeToName.get(c)).join(', ');
                return `For ${range(minTurns, maxTurns)}, absorb ${attrs}.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                enemy.attributeAbsorb = common_11.idxsFromBits(skillArgs[2]);
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                mechanic.attributesAbsorbed |= skillArgs[2];
            },
        };
        // 54
        const directedBindAll = {
            textify: ({ skillArgs }) => {
                const [positionMask, min, max] = skillArgs;
                let text = ['All Monsters'];
                if (positionMask) {
                    text = [];
                    if (positionMask & 1) {
                        text.push('Leader');
                    }
                    if (positionMask & 2) {
                        text.push('Helper');
                    }
                    if (positionMask & 4) {
                        text.push('Subs');
                    }
                }
                return `Binds ${text.join(' and ')} for ${min} to ${max} turns`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => {
                // let [positionMask, min, max] = skillArgs;
                console.warn('Bind not yet supported');
                // positionMask = positionMask || 7;
                // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                if (skillArgs[0] & 1) {
                    mechanic.leaderBind = true;
                }
                if (skillArgs[0] & 2) {
                    mechanic.helperBind = true;
                }
                if (skillArgs[0] & 4) {
                    mechanic.subBind = true;
                }
            },
        };
        // 55
        const healPlayerIfHpBelow = {
            textify: ({ skillArgs }, { atk }) => {
                const [percentHeal, hpThreshold] = skillArgs;
                return `Heal player for ${percentHeal}% HP if player HP <=${hpThreshold}%, else attack for 100% (${common_11.addCommas(atk)})`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                const [percentHeal, hpThreshold] = skillArgs;
                if (percentHeal != hpThreshold) {
                    console.warn('Unprecedented circumstance, percentHeal and hpThreshold have never been different');
                    console.warn(percentHeal, hpThreshold);
                }
                if (team.getHpPercent() <= hpThreshold) {
                    const healing = team.getHp() * percentHeal / 100;
                    team.heal(healing);
                }
                else {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
        };
        // 56
        const singleOrbToPoison = {
            textify: ({ skillArgs }) => `Convert ${skillArgs[0] == -1 ? 'Random' : common_11.AttributeToName.get(skillArgs[0])} color into Poison`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.poisonChange = true;
            },
        };
        // 57
        const multiOrbToPoison = {
            textify: ({ skillArgs }) => `Randomly convert ${skillArgs[0]} colors into Poison`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.poisonChange = true;
            },
        };
        // 60
        const randomPoisonSpawn = {
            textify: ({ skillArgs }) => `Randomly spawn ${skillArgs[0]}x Poison orbs${skillArgs[1] ? ' excluding hearts' : ''}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.poisonChange = true;
            },
        };
        // 62
        const attackAndBlind = {
            textify: ({ skillArgs }, { atk }) => {
                return `Hits once for ${skillArgs[0]}% (${common_11.addCommas(Math.ceil(skillArgs[0] / 100 * atk))}) and blinds the board.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                let [percent] = skillArgs;
                team.damage(Math.ceil(enemy.getAtk() * percent / 100), enemy.getAttribute(), comboContainer);
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { atk, skillArgs }) => {
                mechanic.hits.push(Math.ceil(atk * skillArgs[0] / 100));
                mechanic.blind = true;
            },
        };
        // 63
        const attackAndBind = {
            textify: ({ skillArgs }, { atk }) => {
                const [percent, min, max, positionMask, count] = skillArgs;
                let text = ['All Monsters'];
                if (positionMask) {
                    text = [];
                    if (positionMask & 1) {
                        text.push('Leader');
                    }
                    if (positionMask & 2) {
                        text.push('Helper');
                    }
                    if (positionMask & 4) {
                        text.push('Subs');
                    }
                }
                return `Hits once for ${percent}% (${common_11.addCommas(Math.ceil(percent / 100 * atk))}) and binds ${count} of ${text.join(' and ')} for ${range(min, max)}.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                // let [percent, _min, _max, positionMask, count] = skillArgs;
                team.damage(Math.ceil(enemy.getAtk() * skillArgs[0] / 100), enemy.getAttribute(), comboContainer);
                console.warn('Bind not yet supported');
                // positionMask = positionMask || 7;
                // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs, atk }) => {
                mechanic.hits.push(Math.ceil(skillArgs[0] * atk / 100));
                if (!skillArgs[3] || skillArgs[3] & 1) {
                    mechanic.leaderBind = true;
                }
                if (!skillArgs[3] || skillArgs[3] & 2) {
                    mechanic.helperBind = true;
                }
                if (!skillArgs[3] || skillArgs[3] & 4) {
                    mechanic.subBind = true;
                }
            },
        };
        // 64
        const attackAndPoisonSpawn = {
            textify: ({ skillArgs }, { atk }) => {
                const [percent, count, excludeHearts] = skillArgs;
                const damage = common_11.addCommas(Math.ceil(percent / 100 * atk));
                return `Hit for ${skillArgs[0]}% (${damage}) and spawn ${count} Poison Orbs${excludeHearts ? ' ignoring hearts' : ''}`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                team.damage(Math.ceil(skillArgs[0] * enemy.getAtk() / 100), enemy.getAttribute(), comboContainer);
                // Convert orbs?!
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { atk, skillArgs }) => {
                mechanic.poisonChange = true;
                mechanic.hits.push(Math.ceil(atk * (skillArgs[0] || 0) / 100));
            },
        };
        // 65
        const bindSubs = {
            textify: ({ skillArgs }) => `Binds ${skillArgs[0]} for ${range(skillArgs[1], skillArgs[2])}.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => {
                console.warn('Binds not yet supported');
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.leaderBind = true;
                mechanic.helperBind = true;
                mechanic.subBind = true;
            },
        };
        // 66
        const skipTurn = {
            textify: () => 'Skip Turn',
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
        };
        // 67
        const comboAbsorb = {
            textify: ({ skillArgs }) => `Absorb ${skillArgs[2]} or fewer combos for ${range(skillArgs[0], skillArgs[1])}.`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                enemy.comboAbsorb = skillArgs[2];
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                mechanic.comboAbsorb = Math.max(mechanic.comboAbsorb, skillArgs[2]);
            },
        };
        // 68
        const skyfall = {
            textify: ({ skillArgs }) => {
                const orbs = common_11.idxsFromBits(skillArgs[0]).map((c) => common_11.AttributeToName.get(c));
                return `For ${skillArgs[1]} to ${skillArgs[2]} turns, set ${orbs} skyfall bonus to ${skillArgs[3]}% `;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                const colors = common_11.idxsFromBits(skillArgs[0]);
                if (colors.includes(common_11.Attribute.POISON) || colors.includes(common_11.Attribute.MORTAL_POISON)) {
                    mechanic.poisonSkyfall = true;
                }
                if (colors.includes(common_11.Attribute.JAMMER)) {
                    mechanic.jammerSkyfall = true;
                }
            },
        };
        // 69
        const transformAnimation = {
            textify: () => `[Passive] On death, transform.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.PASSIVE,
        };
        // 71
        const voidDamage = {
            textify: ({ skillArgs }) => `Void Damage of >= ${common_11.addCommas(skillArgs[2])} for ${skillArgs[0]}} turns.`,
            // Add conditional that this can't happen again.
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy, team, comboContainer }) => {
                if (enemy.damageVoid) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                    return;
                }
                enemy.damageVoid = skillArgs[2];
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.damageVoid = true;
            },
        };
        // 72
        const attributeResist = {
            textify: ({ skillArgs }) => `[Passive] ${skillArgs[1]}% ${common_11.idxsFromBits(skillArgs[0]).map(c => common_11.AttributeToName.get(c))} Resist.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.PASSIVE,
        };
        // 73
        const resolve = {
            textify: ({ skillArgs }) => `[Passive] ${skillArgs[0]}% Resolve.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.PASSIVE,
            addMechanic: (mechanic) => {
                mechanic.resolve = true;
            },
        };
        // 74
        const shield = {
            textify: ({ skillArgs }) => `Damage reduced by ${skillArgs[1]}% for ${skillArgs[0]} turns`,
            // TODO: skip if active.
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                enemy.shieldPercent = skillArgs[1];
            },
            goto: () => TERMINATE,
        };
        // 75
        const leadSwap = {
            textify: ({ skillArgs }) => `Lead swap for ${skillArgs[0]} turns`,
            // TODO: skip if active.
            condition: () => true,
            aiEffect: () => { },
            effect: (_, { team, enemy, comboContainer }) => {
                // Cannot swap an already swapped team.
                const subs = team.getActiveTeam().slice(1, 5).map((m, i) => m.getId() > 0 ? i : 0).filter(Boolean);
                if (team.state.leadSwaps[team.activeTeamIdx] || !subs.length) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                    return;
                }
                if (team.getActiveTeam()[0].latents.some((l) => l == common_11.Latent.RESIST_LEADER_SWAP)) {
                    debugger_4.debug.print('Leader Swap Resisted');
                    return;
                }
                let idx = subs[Math.floor(Math.random() * subs.length)];
                team.updateState({
                    leadSwap: idx,
                });
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.leaderSwap = true;
            },
        };
        // 76
        const columnChange = {
            textify: ({ skillArgs }) => {
                const [c1, o1, c2, o2, c3, o3, c4, o4, c5, o5] = skillArgs;
                let text = 'Convert ';
                let columns = [];
                for (const [c, o] of [[c1, o1], [c2, o2], [c3, o3], [c4, o4], [c5, o5]]) {
                    if (c == undefined) {
                        continue;
                    }
                    columns.push(`column(s) ${common_11.idxsFromBits(c)} into ${common_11.idxsFromBits(o).map(i => common_11.AttributeToName.get(i))}`);
                }
                text += columns.join(' and ');
                return text + '.';
            }, condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                const spawnSets = new Set();
                for (const o of [skillArgs[1], skillArgs[3], skillArgs[5], skillArgs[7], skillArgs[9]]) {
                    for (const a of common_11.idxsFromBits(o || 0)) {
                        spawnSets.add(a);
                    }
                }
                if (spawnSets.has(common_11.Attribute.POISON) || spawnSets.has(common_11.Attribute.MORTAL_POISON)) {
                    mechanic.poisonChange = true;
                }
                if (spawnSets.has(common_11.Attribute.JAMMER) || spawnSets.has(common_11.Attribute.BOMB)) {
                    mechanic.jammerChange = true;
                }
            },
        };
        // 77
        const attackAndColumnChange = {
            textify: ({ skillArgs }, { atk }) => {
                const [c1, o1, c2, o2, c3, o3, percent] = skillArgs;
                let text = `Deal ${percent}% (${common_11.addCommas(Math.ceil(percent * atk / 100))}), Convert `;
                let columns = [];
                for (const [c, o] of [[c1, o1], [c2, o2], [c3, o3]]) {
                    if (c == undefined) {
                        continue;
                    }
                    columns.push(`column(s) ${common_11.idxsFromBits(c)} into ${common_11.idxsFromBits(o).map(i => common_11.AttributeToName.get(i))}`);
                }
                text += columns.join(' and ');
                return text + '.';
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                const damage = Math.ceil(enemy.getAtk() / 100 * skillArgs[6]);
                team.damage(damage, enemy.getAttribute(), comboContainer);
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs, atk }) => {
                const spawnSets = new Set();
                for (const o of [skillArgs[1], skillArgs[3], skillArgs[5]]) {
                    for (const a of common_11.idxsFromBits(o || 0)) {
                        spawnSets.add(a);
                    }
                }
                if (spawnSets.has(common_11.Attribute.POISON) || spawnSets.has(common_11.Attribute.MORTAL_POISON)) {
                    mechanic.poisonChange = true;
                }
                if (spawnSets.has(common_11.Attribute.JAMMER) || spawnSets.has(common_11.Attribute.BOMB)) {
                    mechanic.jammerChange = true;
                }
                mechanic.hits.push(Math.ceil(skillArgs[6] * atk / 100));
            },
        };
        // 78
        const rowChange = {
            textify: ({ skillArgs }) => {
                const [r1, o1, r2, o2, r3, o3, r4, o4, r5, o5] = skillArgs;
                let text = 'Convert ';
                let columns = [];
                for (const [r, o] of [[r1, o1], [r2, o2], [r3, o3], [r4, o4], [r5, o5]]) {
                    if (r == undefined) {
                        continue;
                    }
                    columns.push(`row(s) ${common_11.idxsFromBits(r)} into ${common_11.idxsFromBits(o).map(i => common_11.AttributeToName.get(i))}`);
                }
                text += columns.join(' and ');
                return text + '.';
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                const spawnSets = new Set();
                for (const o of [skillArgs[1], skillArgs[3], skillArgs[5], skillArgs[7], skillArgs[9]]) {
                    for (const a of common_11.idxsFromBits(o || 0)) {
                        spawnSets.add(a);
                    }
                }
                if (spawnSets.has(common_11.Attribute.POISON) || spawnSets.has(common_11.Attribute.MORTAL_POISON)) {
                    mechanic.poisonChange = true;
                }
                if (spawnSets.has(common_11.Attribute.JAMMER) || spawnSets.has(common_11.Attribute.BOMB)) {
                    mechanic.jammerChange = true;
                }
            },
        };
        // 79
        const attackAndRowChange = {
            textify: ({ skillArgs }, { atk }) => {
                const [r1, o1, r2, o2, r3, o3, percent] = skillArgs;
                let text = `Deal ${percent}% (${common_11.addCommas(Math.ceil(percent * atk / 100))}), Convert `;
                let columns = [];
                for (const [r, o] of [[r1, o1], [r2, o2], [r3, o3]]) {
                    if (!r == undefined) {
                        continue;
                    }
                    columns.push(`row(s) ${common_11.idxsFromBits(r)} into ${common_11.idxsFromBits(o).map(i => common_11.AttributeToName.get(i))}`);
                }
                text += columns.join(' and ');
                return text + '.';
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                const damage = Math.ceil(enemy.getAtk() / 100 * skillArgs[6]);
                team.damage(damage, enemy.getAttribute(), comboContainer);
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs, atk }) => {
                const spawnSets = new Set();
                for (const o of [skillArgs[1], skillArgs[3], skillArgs[5]]) {
                    for (const a of common_11.idxsFromBits(o || 0)) {
                        spawnSets.add(a);
                    }
                }
                if (spawnSets.has(common_11.Attribute.POISON) || spawnSets.has(common_11.Attribute.MORTAL_POISON)) {
                    mechanic.poisonChange = true;
                }
                if (spawnSets.has(common_11.Attribute.JAMMER) || spawnSets.has(common_11.Attribute.BOMB)) {
                    mechanic.jammerChange = true;
                }
                mechanic.hits.push(Math.ceil(skillArgs[6] * atk / 100));
            },
        };
        // 81
        const attackAndChangeBoardOld = {
            textify: ({ skillArgs }, { atk }) => {
                const colors = [];
                for (let i = 1; i < skillArgs.length; i++) {
                    if (skillArgs[i] == -1) {
                        break;
                    }
                    colors.push(common_11.AttributeToName.get(skillArgs[i]));
                }
                return `Attack of ${skillArgs[0]}% (${common_11.addCommas(Math.ceil(skillArgs[0] * atk / 100))}) and change board to ${colors.join(', ')}`;
            },
            // TODO: Add conditional depending on board.
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy, team, comboContainer }) => {
                const damage = Math.ceil(skillArgs[0] / 100 * enemy.getAtk());
                team.damage(damage, enemy.getAttribute(), comboContainer);
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs, atk }) => {
                mechanic.hits.push(Math.ceil(skillArgs[0] * atk / 100));
                for (let i = 1; i < skillArgs.length && skillArgs[i] >= 0; i++) {
                    if (skillArgs[i] == common_11.Attribute.POISON || skillArgs[i] == common_11.Attribute.MORTAL_POISON) {
                        mechanic.poisonChange = true;
                    }
                    if (skillArgs[i] == common_11.Attribute.JAMMER || skillArgs[i] == common_11.Attribute.BOMB) {
                        mechanic.jammerChange = true;
                    }
                }
            },
        };
        // 82
        const attackWithoutName = {
            textify: (_, { atk }) => {
                return `Attack of ${common_11.addCommas(atk)}.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { atk }) => {
                mechanic.hits.push(atk);
            },
        };
        // 83
        const skillset = {
            textify: (skillCtx, ctx) => {
                const subEffects = skillCtx.skillArgs.map((skillId) => {
                    const effect = ilmina_stripped_8.floof.getEnemySkill(skillId);
                    const newContext = {
                        id: skillId,
                        ai: skillCtx.ai,
                        rnd: skillCtx.rnd,
                        ratio: effect.ratio,
                        effectId: effect.internalEffectId,
                        name: effect.name,
                        text: effect.usageText,
                        aiArgs: [...effect.aiArgs],
                        skillArgs: [...effect.skillArgs],
                    };
                    return ` * ${textify(ctx, newContext)} `;
                }).join('\n');
                return `Use all of the following: \n` + subEffects;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: (skillCtx, ctx) => {
                for (const skillId of skillCtx.skillArgs) {
                    const eff = ilmina_stripped_8.floof.getEnemySkill(skillId);
                    const newContext = {
                        id: skillId,
                        ai: skillCtx.ai,
                        rnd: skillCtx.rnd,
                        ratio: eff.ratio,
                        effectId: eff.internalEffectId,
                        name: eff.name,
                        text: eff.usageText,
                        aiArgs: [...eff.aiArgs],
                        skillArgs: [...eff.skillArgs],
                    };
                    effect(newContext, ctx);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, ctx) => {
                for (const skillId of ctx.skillArgs) {
                    const eff = ilmina_stripped_8.floof.getEnemySkill(skillId);
                    const subCtx = {
                        atk: ctx.atk,
                        skillArgs: [...eff.skillArgs],
                        aiArgs: [...eff.aiArgs],
                    };
                    addMechanic(mechanic, skillId, subCtx);
                }
            }
        };
        // 84
        const boardChange = {
            textify: ({ skillArgs }) => {
                return `Change board to ${common_11.idxsFromBits(skillArgs[0]).map(c => common_11.AttributeToName.get(c))} `;
            },
            // TODO: Add conditional depending on board.
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                for (const o of common_11.idxsFromBits(skillArgs[0])) {
                    if (o == common_11.Attribute.POISON || o == common_11.Attribute.MORTAL_POISON) {
                        mechanic.poisonChange = true;
                    }
                    if (o == common_11.Attribute.JAMMER || o == common_11.Attribute.BOMB) {
                        mechanic.jammerChange = true;
                    }
                }
            },
        };
        // 85
        const attackAndChangeBoard = {
            textify: ({ skillArgs }, { atk }) => {
                return `Attack of ${skillArgs[0]}% (${common_11.addCommas(Math.ceil(skillArgs[0] * atk / 100))}) and change board to ${common_11.idxsFromBits(skillArgs[1]).map(c => common_11.AttributeToName.get(c))} `;
            },
            // TODO: Add conditional depending on board.
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy, team, comboContainer }) => {
                const damage = Math.ceil(skillArgs[0] / 100 * enemy.getAtk());
                team.damage(damage, enemy.getAttribute(), comboContainer);
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs, atk }) => {
                mechanic.hits.push(Math.ceil(skillArgs[0] * atk / 100));
                for (const o of common_11.idxsFromBits(skillArgs[1])) {
                    if (o == common_11.Attribute.POISON || o == common_11.Attribute.MORTAL_POISON) {
                        mechanic.poisonChange = true;
                    }
                    if (o == common_11.Attribute.JAMMER || o == common_11.Attribute.BOMB) {
                        mechanic.jammerChange = true;
                    }
                }
            },
        };
        // 86
        const healPercent = {
            textify: ({ skillArgs }) => `Heal for ${range(skillArgs[0], skillArgs[1], '', '')}% of max HP.`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                const [min, max] = skillArgs;
                const percentHealed = Math.floor(Math.random() * (max - min)) + min;
                const healAmount = Math.ceil(percentHealed * enemy.getHp() / 100);
                if (enemy.currentHp + healAmount > enemy.getHp()) {
                    enemy.currentHp = enemy.getHp();
                }
                else {
                    enemy.currentHp += healAmount;
                }
            },
            goto: () => TERMINATE,
        };
        // 87
        const damageAbsorb = {
            textify: ({ skillArgs }) => `Absorb damage of ${common_11.addCommas(skillArgs[1])} or more for ${skillArgs[0]} turns`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { enemy }) => {
                enemy.damageAbsorb = skillArgs[1];
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.damageAbsorb = true;
            },
        };
        // 88
        const awokenBind = {
            textify: ({ skillArgs }, { atk }) => {
                return `Awoken Bind for ${skillArgs[0]} turn(s). If awoken bound and part of a skillset, attack for ${common_11.addCommas(atk)}, else Continue.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: (_, { team, enemy, comboContainer }) => {
                if (team.state.awakenings) {
                    team.state.awakenings = false;
                }
                else {
                    // Should we do a basic attack here?
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                }
            },
            // TODO: If player is awoken bound, this should be TO_NEXT
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.awokenBind = true;
            },
        };
        // 89
        const skillDelay = {
            textify: ({ skillArgs }) => {
                return `Skill Delay for ${range(skillArgs[0], skillArgs[1])}.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                mechanic.skillDelay = Math.max(mechanic.skillDelay, skillArgs[1]);
            },
        };
        // 90
        const gotoIfCardOnTeam = {
            textify: ({ rnd, skillArgs }) => {
                return `If any of ${skillArgs.filter(Boolean).map(id => ilmina_stripped_8.floof.getCard(id).name)} are on the team, go to skill at ${rnd}`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ skillArgs, rnd }, { teamIds }) => skillArgs.some((id) => teamIds.includes(id)) ? rnd - 1 : TO_NEXT,
            type: SkillType.LOGIC,
        };
        // 92
        const randomOrbSpawn = {
            textify: ({ skillArgs }) => `Randomly spawn ${skillArgs[0]}x ${common_11.idxsFromBits(skillArgs[1]).map(c => common_11.AttributeToName.get(c))} orbs from non-[${common_11.idxsFromBits(skillArgs[2]).map((c) => common_11.AttributeToName.get(c))}], If Unable, Continue`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                for (const o of common_11.idxsFromBits(skillArgs[1])) {
                    if (o == common_11.Attribute.POISON || o == common_11.Attribute.MORTAL_POISON) {
                        mechanic.poisonChange = true;
                    }
                    if (o == common_11.Attribute.JAMMER || o == common_11.Attribute.BOMB) {
                        mechanic.jammerChange = true;
                    }
                }
            },
        };
        // 93
        const finalFantasyAndContinue = {
            textify: () => `Final Fantasy Nonsense according to Ilmina. Continue.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TO_NEXT,
        };
        // 94
        const lockOrbs = {
            textify: ({ skillArgs }) => {
                const [attrBits, maxLocked] = skillArgs;
                const lockedOrbs = common_11.idxsFromBits(attrBits).map((c) => common_11.AttributeToName.get(c)).join(', ');
                return `Lock up to ${maxLocked} of the following orbs: ${lockedOrbs}. If unable to lock any, Continue.`;
            },
            condition: () => {
                // Not applicable right now, but requires that one of the locked colors exists.
                return true;
            },
            aiEffect: () => { },
            effect: () => { },
            // TODO: Determine if any orbs can be locked.  If no, then return TO_NEXT instead.
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.lock = true;
            },
        };
        // 95
        const onDeathSkillset = {
            textify: (...args) => skillset.textify(...args).replace('U', 'On death, u'),
            condition: () => false,
            aiEffect: () => { },
            effect: (...args) => skillset.effect(...args),
            goto: () => TO_NEXT,
        };
        // 96
        const lockSkyfall = {
            textify: ({ skillArgs }) => {
                const [attrBits, minTurns, maxTurns, percent] = skillArgs;
                if (!attrBits || attrBits == -1) {
                    return `Lock ${percent}% skyfall for ${range(minTurns, maxTurns)}.`;
                }
                const lockedOrbs = common_11.idxsFromBits(attrBits).map((c) => common_11.AttributeToName.get(c)).join(', ');
                return `Lock ${percent}% of ${lockedOrbs} skyfall for ${range(minTurns, maxTurns)}`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.lock = true;
            },
        };
        // 97
        const randomStickyBlind = {
            textify: ({ skillArgs, aiArgs }, { atk }) => {
                let text = `Randomly sticky blind ${range(skillArgs[1], skillArgs[2], ' orb', ' orbs')} for ${skillArgs[0]} turns.`;
                if (aiArgs[4]) {
                    text = text.replace('.', ` and attack for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))})`);
                }
                return text;
            },
            condition: () => true,
            aiEffect: () => { },
            // Implement later?!
            effect: ({ aiArgs }, { team, enemy, comboContainer }) => {
                if (aiArgs[4]) {
                    team.damage(Math.ceil(enemy.getAtk() * aiArgs[4] / 100), enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.blind = true;
            },
        };
        // 98
        const patternStickyBlind = {
            textify: ({ skillArgs }) => `Sticky blind a pattern for ${skillArgs[0]} turns: Pattern: ${skillArgs.slice(1)}.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.blind = true;
            },
        };
        // 99
        const tapeColumns = {
            textify: ({ skillArgs, aiArgs }, { atk }) => {
                let text = `Tape columns ${common_11.idxsFromBits(skillArgs[0])} for ${skillArgs[1]} turns.`;
                if (aiArgs[4]) {
                    text = text.replace('.', ` and attack for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))})`);
                }
                return text;
            },
            condition: () => true,
            aiEffect: () => { },
            // Implement later?!
            effect: ({ aiArgs }, { team, enemy, comboContainer }) => {
                if (aiArgs[4]) {
                    team.damage(Math.ceil(enemy.getAtk() * aiArgs[4] / 100), enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.tape = true;
            },
        };
        // 100
        const tapeRows = {
            textify: ({ skillArgs, aiArgs }, { atk }) => {
                let text = `Tape rows ${common_11.idxsFromBits(skillArgs[0])} for ${skillArgs[1]} turns.`;
                if (aiArgs[4]) {
                    text = text.replace('.', ` and attack for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))})`);
                }
                return text;
            },
            condition: () => true,
            aiEffect: () => { },
            // Implement later?!
            effect: ({ aiArgs }, { team, enemy, comboContainer }) => {
                if (aiArgs[4]) {
                    team.damage(Math.ceil(enemy.getAtk() * aiArgs[4] / 100), enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.tape = true;
            },
        };
        // 101
        const fixedStartingPoint = {
            textify: ({ skillArgs }) => `Fixed starting point at ${skillArgs[0] ? 'Random Location' : `${skillArgs[2]}-${skillArgs[1]}`}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
        };
        // 102
        const randomBombSpawn = {
            textify: ({ skillArgs }) => `Randomly spawn ${skillArgs[1]}x bomb orbs`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.jammerChange = true;
            },
        };
        // 103
        const patternBombSpawn = {
            textify: ({ skillArgs }) => `Spawn ${skillArgs[7] ? 'Locked ' : ''}Bomb orbs in a pattern: ${skillArgs.slice(1, 7)}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs }) => {
                mechanic.jammerChange = true;
                if (skillArgs[7]) {
                    mechanic.lock = true;
                }
            },
        };
        // 104
        const cloudRandom = {
            textify: ({ skillArgs, aiArgs }, { atk }) => {
                let text = `Randomly Cloud ${skillArgs[1]}x${skillArgs[2]} Rectangle for ${skillArgs[0]} turns.`;
                if (aiArgs[4]) {
                    text = text.replace('.', ` and attack for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))}).`);
                }
                return text;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ aiArgs }, { team, enemy, comboContainer }) => {
                if (aiArgs[4]) {
                    team.damage(Math.ceil(enemy.getAtk() * aiArgs[4] / 100), enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.cloud = true;
            },
        };
        // 105
        const rcv = {
            textify: ({ skillArgs }) => {
                const [turns, rcvPercent] = skillArgs;
                return `Set Recovery to ${rcvPercent}% for ${turns} turns`;
            },
            // Determine if already debuffed by opponent?!
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                if (team.state.rcvMult != 1) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                    return;
                }
                team.state.rcvMult = (skillArgs[1] || 0) / 100;
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.rcvDebuff = true;
            },
        };
        // 106
        const changeTurnTimer = {
            textify: ({ skillArgs }) => `[Passive] When HP Drops below ${skillArgs[0]}%, change turn timer to ${skillArgs[1]}`,
            condition: () => true,
            aiEffect: () => { },
            // This will occur in the damage step.
            effect: () => { },
            goto: () => TERMINATE,
            type: SkillType.PASSIVE,
        };
        // 107
        const unmatchable = {
            textify: ({ skillArgs }) => `${common_11.idxsFromBits(skillArgs[1]).map(c => common_11.AttributeToName.get(c))} are unmatchable for ${skillArgs[0]} turn(s)`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.unmatchable = true;
            },
        };
        // 108
        const attackAndMultiOrbChange = {
            textify: ({ skillArgs }, { atk }) => {
                const [percent, fromBits, toBits] = skillArgs;
                const damage = common_11.addCommas(Math.ceil(percent / 100 * atk));
                const fromString = common_11.idxsFromBits(fromBits).map(from => common_11.AttributeToName.get(from) || 'Fire');
                const toString = common_11.idxsFromBits(toBits).map(to => common_11.AttributeToName.get(to));
                return `Hit for ${skillArgs[0]}% (${damage}) and convert ${fromString} to ${toString}`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                team.damage(Math.ceil(skillArgs[0] * enemy.getAtk() / 100), enemy.getAttribute(), comboContainer);
                // Convert orbs?!
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic, { skillArgs, atk }) => {
                mechanic.hits.push(Math.ceil(skillArgs[0] * atk / 100));
                for (const o of common_11.idxsFromBits(skillArgs[2])) {
                    if (o == common_11.Attribute.POISON || o == common_11.Attribute.MORTAL_POISON) {
                        mechanic.poisonChange = true;
                    }
                    if (o == common_11.Attribute.JAMMER || o == common_11.Attribute.BOMB) {
                        mechanic.jammerChange = true;
                    }
                }
            },
        };
        // 109
        const spinners = {
            textify: ({ skillArgs }) => {
                const [turns, period, count] = skillArgs;
                return `Spawn ${count}x Spinners (${period / 100}s period) for ${turns} turns`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.spinner = true;
            },
        };
        // 110
        const spinnerPattern = {
            textify: ({ skillArgs }) => {
                const [turns, period, r1, r2, r3, r4, r5] = skillArgs;
                return `Spawn Spinners (${period / 100}s period) for ${turns} turns in a pattern: ${[r1, r2, r3, r4, r5]}`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.spinner = true;
            },
        };
        // 111
        const fixedHp = {
            textify: ({ skillArgs }) => `Player team HP set to ${skillArgs[0] ? `${skillArgs[0]}%` : `${skillArgs[1]}`} for ${skillArgs[2]} turns.`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team }) => {
                let [percent, val] = skillArgs;
                if (percent) {
                    val = Math.ceil(team.getHp() * percent / 100);
                }
                team.updateState({ fixedHp: val });
            },
            goto: () => TERMINATE,
        };
        // 112
        const fixedTarget = {
            textify: () => `Fixed target on this monster`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
        };
        // 113
        const gotoIfComboMin = {
            textify: ({ ai, rnd }) => `If combo count >= ${ai}, go to skill ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }, { combo }) => {
                return combo >= ai ? rnd - 1 : TO_NEXT;
            },
            type: SkillType.LOGIC,
        };
        // 118
        const resistTypes = {
            textify: ({ skillArgs }) => `[Passive] Resist ${skillArgs[1]}% of ${common_11.idxsFromBits(skillArgs[0]).map((v) => common_11.TypeToName.get(v)).join(' and ')} damage.`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.PASSIVE,
        };
        // 119
        const addInvincibility = {
            textify: () => `Unable to receive damage.`,
            condition: () => true,
            aiEffect: () => { },
            // This will occur in the damage step.
            effect: (_, { enemy }) => {
                enemy.invincible = true;
            },
            goto: () => TERMINATE,
        };
        // 120
        const gotoIfEnemiesRemaining = {
            textify: ({ ai, rnd }) => `If ${ai} enemies remaining, go to skill ${rnd}`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: ({ ai, rnd }) => {
                console.warn(`Multiple enemies not supported, assuming ${ai} remaining`);
                return rnd;
            },
            type: SkillType.LOGIC,
        };
        // 121
        const removeInvincibility = {
            textify: () => `Now able to receive damage.`,
            condition: () => true,
            aiEffect: () => { },
            // This will occur in the damage step.
            effect: (_, { enemy }) => {
                enemy.invincible = false;
            },
            goto: () => TERMINATE,
        };
        // 122
        const changeTurnTimerFromRemainingEnemies = {
            textify: ({ skillArgs }) => `[Pasive] When ${skillArgs[0]} enemies, change turn timer to ${skillArgs[1]}`,
            condition: () => true,
            aiEffect: () => { },
            // This will occur in the damage step.
            effect: () => { },
            goto: () => TERMINATE,
        };
        // 124
        const gachadra = {
            textify: ({ skillArgs }) => `[Pasive] GACHADRA FEVER - Requires ${skillArgs[1]}x ${common_11.AttributeToName.get(skillArgs[0])} orbs to kill`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
        };
        // 125
        const transformLead = {
            textify: ({ skillArgs }) => `Transform player lead into ${ilmina_stripped_8.floof.getCard(skillArgs[1]).name} for ${skillArgs[0]} turns.`,
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team }) => {
                team.getActiveTeam()[0].transformedTo = skillArgs[1];
            },
            goto: () => TERMINATE,
        };
        // 126
        const boardChangeOrContinue = {
            textify: ({ skillArgs }, { atk }) => {
                const [turns, sizeEnum] = skillArgs;
                let size = '';
                if (sizeEnum == 1) {
                    size = '7x6';
                }
                else if (sizeEnum == 3) {
                    size = '6x5';
                }
                else {
                    console.error('Unhandled Size Flagz: ' + String(sizeEnum));
                }
                return `Change board to ${size} for ${turns} turns. If already ${size}: If part of skillset, hit for ${common_11.addCommas(atk)}, else Continue.`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs }, { team, comboContainer, enemy }) => {
                if ((comboContainer.getBoardSize() == 42) == (skillArgs[1] == 1)) {
                    team.damage(enemy.getAtk(), enemy.getAttribute(), comboContainer);
                    return;
                }
                comboContainer.comboEditor.boardWidthInput.value = (skillArgs[1] == 1) ? '7' : '6';
                comboContainer.update();
            },
            goto: ({ skillArgs }, { bigBoard }) => {
                return bigBoard == (skillArgs[1] == 1) ? TO_NEXT : TERMINATE;
            },
        };
        // 127
        const attackAndNoSkyfall = {
            textify: ({ skillArgs }, { atk }) => skillArgs[0] ? `Attack of ${skillArgs[0]}% (${common_11.addCommas(Math.ceil(skillArgs[0] * atk / 100))}) and n` : 'N' + `o-skyfall for ${skillArgs[1]} turn(s).`,
            condition: () => true,
            aiEffect: () => { },
            // This will occur in the damage step.
            effect: ({ skillArgs }, { team, enemy, comboContainer }) => {
                if (skillArgs[0]) {
                    team.damage(Math.ceil(skillArgs[0] * enemy.getAtk() / 100), enemy.getAttribute(), comboContainer);
                }
                // No skyfall?!
            },
            goto: (_, { bigBoard }) => bigBoard ? TO_NEXT : TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.noSkyfall = true;
            },
        };
        // 128
        const stickyBlindSkyfall = {
            textify: ({ skillArgs }) => `For ${skillArgs[0]} turns, set ${skillArgs[1]}% skyfall chance of Sticky Blinds`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TERMINATE,
        };
        // 129
        const superResolve = {
            textify: ({ skillArgs }) => `[Passive] ${skillArgs[0]}% Super Resolve. [Unknown handling of parameter ${skillArgs[1]}]`,
            condition: () => true,
            aiEffect: () => { },
            effect: () => { },
            goto: () => TO_NEXT,
            type: SkillType.PASSIVE,
            addMechanic: (mechanic) => {
                mechanic.superResolve = true;
            },
        };
        // 130
        const playerAtkDebuff = {
            textify: ({ skillArgs, aiArgs }, { atk }) => {
                const [turns, debuffPercent] = skillArgs;
                return `Player team attack reduced by ${debuffPercent} for ${turns} turns${aiArgs[4] ? ` and attack for ${aiArgs[4]}% (${common_11.addCommas(Math.ceil(atk * aiArgs[4] / 100))})` : ''}`;
            },
            condition: () => true,
            aiEffect: () => { },
            effect: ({ skillArgs, aiArgs }, { team, enemy, comboContainer }) => {
                team.state.burst.attrRestrictions.length = 0;
                team.state.burst.typeRestrictions.length = 0;
                team.state.burst.awakenings.length = 0;
                team.state.burst.awakeningScale = 0;
                team.state.burst.multiplier = 1 - (skillArgs[1] / 100);
                if (aiArgs[4]) {
                    const damage = Math.ceil(enemy.getAtk() * skillArgs[4] / 100);
                    team.damage(damage, enemy.getAttribute(), comboContainer);
                }
            },
            goto: () => TERMINATE,
            addMechanic: (mechanic) => {
                mechanic.atkDebuff = true;
            },
        };
        const ENEMY_SKILL_GENERATORS = {
            1: bindRandom,
            2: bindAttr,
            3: bindType,
            4: orbChange,
            5: blindBoard,
            6: dispelBuffs,
            7: healOrAttack,
            8: enhanceBasicAttack,
            // 9: unused
            // 10: unused
            // 11: unused
            12: singleOrbToJammer,
            13: multiOrbToJammer,
            14: skillBind,
            15: multihit,
            16: skipTurn,
            17: enrage,
            18: enrageFromStatusAilment,
            19: enrageFromMinimumAttacks,
            20: statusShield,
            // 21: unused
            22: setFlagAndContinue,
            23: goto0IndexIfFlag,
            24: unsetFlagAndContinue,
            25: setCounterToAiAndContinue,
            26: incrementCounterAndContinue,
            27: decrementCounterAndContinue,
            28: gotoIfHpBelow,
            29: gotoIfHpAbove,
            30: gotoIfCounterLesser,
            31: gotoIfCounterEqual,
            32: gotoIfCounterGreater,
            33: gotoIfLvLesser,
            34: gotoIfLvEqual,
            35: gotoIfLvGreater,
            36: fallbackAttack,
            37: displayCounterOrContinue,
            38: setCounterAndContinue,
            39: timeDebuff,
            40: suicide,
            // 41: unused
            // 42: unused
            43: gotoIfFlag,
            44: orFlagsAndContinue,
            45: toggleFlagsAndContinue,
            46: changeAttribute,
            47: oldPreemptiveAttack,
            48: attackAndSingleOrbChange,
            49: preemptiveMarker,
            50: gravity,
            // 51: unused
            52: resurrect,
            53: attributeAbsorb,
            54: directedBindAll,
            55: healPlayerIfHpBelow,
            56: singleOrbToPoison,
            57: multiOrbToPoison,
            // 58: unused
            // 59: unused
            60: randomPoisonSpawn,
            61: randomPoisonSpawn,
            62: attackAndBlind,
            63: attackAndBind,
            64: attackAndPoisonSpawn,
            65: bindSubs,
            66: skipTurn,
            67: comboAbsorb,
            68: skyfall,
            69: transformAnimation,
            // 70: unused
            71: voidDamage,
            72: attributeResist,
            73: resolve,
            74: shield,
            75: leadSwap,
            76: columnChange,
            77: attackAndColumnChange,
            78: rowChange,
            79: attackAndRowChange,
            // 80: unused
            81: attackAndChangeBoardOld,
            82: attackWithoutName,
            83: skillset,
            84: boardChange,
            85: attackAndChangeBoard,
            86: healPercent,
            87: damageAbsorb,
            88: awokenBind,
            89: skillDelay,
            90: gotoIfCardOnTeam,
            // 91: unused,
            92: randomOrbSpawn,
            93: finalFantasyAndContinue,
            94: lockOrbs,
            95: onDeathSkillset,
            96: lockSkyfall,
            97: randomStickyBlind,
            98: patternStickyBlind,
            99: tapeColumns,
            100: tapeRows,
            101: fixedStartingPoint,
            102: randomBombSpawn,
            103: patternBombSpawn,
            104: cloudRandom,
            105: rcv,
            106: changeTurnTimer,
            107: unmatchable,
            108: attackAndMultiOrbChange,
            109: spinners,
            110: spinnerPattern,
            111: fixedHp,
            112: fixedTarget,
            113: gotoIfComboMin,
            // 114: unused
            // 115: unused
            // 116: unused
            // 117: unused
            118: resistTypes,
            119: addInvincibility,
            120: gotoIfEnemiesRemaining,
            121: removeInvincibility,
            122: changeTurnTimerFromRemainingEnemies,
            123: addInvincibility,
            124: gachadra,
            125: transformLead,
            126: boardChangeOrContinue,
            127: attackAndNoSkyfall,
            128: stickyBlindSkyfall,
            129: superResolve,
            130: playerAtkDebuff,
        };
        function toSkillContext(id, skillIdx) {
            const cardEnemySkill = ilmina_stripped_8.floof.getCard(id).enemySkills[skillIdx];
            const skill = {
                id: -1,
                ai: -1,
                rnd: -1,
                aiArgs: [0, 0, 0, 0, 0],
                effectId: -1,
                name: '',
                text: '',
                skillArgs: [],
                ratio: 0,
            };
            if (!cardEnemySkill) {
                return skill;
            }
            skill.id = cardEnemySkill.enemySkillId;
            skill.ai = cardEnemySkill.ai;
            skill.rnd = cardEnemySkill.rnd;
            const enemySkill = ilmina_stripped_8.floof.getEnemySkill(skill.id);
            if (!enemySkill) {
                return skill;
            }
            skill.aiArgs = [...enemySkill.aiArgs];
            skill.effectId = enemySkill.internalEffectId;
            skill.name = enemySkill.name;
            skill.text = enemySkill.usageText;
            skill.skillArgs = [...enemySkill.skillArgs];
            skill.ratio = enemySkill.ratio;
            return skill;
        }
        exports.toSkillContext = toSkillContext;
        var UnusedReason;
        (function (UnusedReason) {
            UnusedReason[UnusedReason["LOGIC"] = 0] = "LOGIC";
            UnusedReason[UnusedReason["HP_NOT_MET"] = 1] = "HP_NOT_MET";
            UnusedReason[UnusedReason["INSUFFICIENT_CHARGES"] = 2] = "INSUFFICIENT_CHARGES";
            UnusedReason[UnusedReason["RNG"] = 3] = "RNG";
        })(UnusedReason || (UnusedReason = {}));
        const PREEMPTIVE_MARKERS = [47, 49];
        /**
         * Get the indexes of the skills to possibly use.
         * The return value is kind of weird, but let's dig down into the meanings.
         * aiEffects: The logic-based effects that occur in the order that they occur.
         *   These can cause counter and flag changes.
         *   If a final effect isn't deterministic, some of these may only occur if
         *   the final effect that is used is >= finalEffectConditional.
         * finalEffects: The final effects that the opponent does to the game state.
         *   This is indexed 0 and is not always deterministic. The total weight usually
         *   adds to 100, but may be any positive number.
         *   If index is -1, that means that this monster has no skills.
         */
        function determineSkillset(ctx) {
            const possibleEffects = [];
            const skills = Array(ilmina_stripped_8.floof.getCard(ctx.cardId).enemySkills.length);
            if (!skills.length) {
                return possibleEffects;
            }
            for (let i = 0; i < skills.length; i++) {
                skills[i] = toSkillContext(ctx.cardId, i);
            }
            // Skip Preemptive checking if neither marker is a preemptive.
            if (ctx.isPreempt && !PREEMPTIVE_MARKERS.includes(skills[0].effectId)) {
                return possibleEffects;
            }
            let idx = 0;
            let remainingChance = 100;
            const path = [];
            // const finalEffects: { idx: number; weight: number }[] = [];
            // const skippedEffects: number[] = [];
            while (idx < skills.length) {
                const skill = skills[idx];
                // Remaining charge cost insufficient.
                if (skillType(ctx.cardId, idx) == SkillType.EFFECT && skill.aiArgs[3] > ctx.charges) {
                    path.push({ idx, unusedReason: UnusedReason.INSUFFICIENT_CHARGES });
                    idx++;
                    continue;
                }
                aiEffect(ctx, idx);
                let next = goto(ctx, idx);
                // HP Conditional skills.
                if (next == TERMINATE && skill.aiArgs[1] < ctx.hpPercent) {
                    path.push({ idx, unusedReason: UnusedReason.HP_NOT_MET });
                    idx++;
                    continue;
                }
                if (next == TERMINATE) {
                    // If neither rnd or ai are set on a terminating skill, assume it MUST happen.
                    let chance = skills[idx].rnd || skills[idx].ai || 100;
                    ctx.charges -= skill.aiArgs[3];
                    if (ilmina_stripped_8.floof.getCard(ctx.cardId).aiVersion == 1) {
                        // Do new
                        chance = Math.min(chance, remainingChance);
                        remainingChance -= chance;
                        possibleEffects.push({ idx, chance: chance, flags: ctx.flags, counter: ctx.counter, path: path.slice() });
                    }
                    else {
                        const overallChance = remainingChance * chance / 100;
                        remainingChance -= overallChance;
                        possibleEffects.push({ idx, chance: overallChance, flags: ctx.flags, counter: ctx.counter, path: path.slice() });
                    }
                    if (!remainingChance) {
                        return possibleEffects;
                    }
                    path.push({ idx, unusedReason: UnusedReason.RNG });
                    next = TO_NEXT;
                }
                else {
                    path.push({ idx, unusedReason: UnusedReason.LOGIC });
                }
                if (next == TO_NEXT) {
                    idx++;
                }
                else {
                    idx = next;
                }
            }
            // Not all chance was used. Should still return.
            return possibleEffects;
        }
        exports.determineSkillset = determineSkillset;
        function effect(skillCtx, ctx) {
            if (!ENEMY_SKILL_GENERATORS[skillCtx.effectId]) {
                console.warn(`UNIMPLEMENTED EFFECT ID: ${skillCtx.effectId} `);
                return;
            }
            ENEMY_SKILL_GENERATORS[skillCtx.effectId].effect(skillCtx, ctx);
        }
        exports.effect = effect;
        function addMechanic(mechanic, id, ctx) {
            const skill = ilmina_stripped_8.floof.getEnemySkill(id);
            if (!ENEMY_SKILL_GENERATORS[skill.internalEffectId]) {
                console.warn(`UNIMPLEMENTED EFFECT ID: ${id}`);
                return;
            }
            const fn = ENEMY_SKILL_GENERATORS[skill.internalEffectId].addMechanic;
            if (fn) {
                fn(mechanic, ctx);
            }
        }
        exports.addMechanic = addMechanic;
        function textify(ctx, skillCtx) {
            if (!ENEMY_SKILL_GENERATORS[skillCtx.effectId]) {
                return `UNIMPLEMENTED EFFECT ID: ${skillCtx.effectId} \n${JSON.stringify(skillCtx)} `;
            }
            let text = ENEMY_SKILL_GENERATORS[skillCtx.effectId].textify(skillCtx, ctx);
            const next = ENEMY_SKILL_GENERATORS[skillCtx.effectId].goto(skillCtx, ctx);
            if (next == TERMINATE && skillCtx.aiArgs[1] != 100) {
                text = `(<= ${skillCtx.aiArgs[1]} % HP) ${text}`;
            }
            if (skillCtx.aiArgs[3]) {
                text = `[Costs ${skillCtx.aiArgs[3]} charges to use] ${text}`;
            }
            if (skillCtx.name && !skillCtx.name.includes('ERROR')) {
                text = `[${skillCtx.name}] ${text}`;
            }
            return text;
        }
        exports.textify = textify;
        function aiEffect(ctx, skillIdx) {
            const skill = toSkillContext(ctx.cardId, skillIdx);
            const effect = ENEMY_SKILL_GENERATORS[skill.effectId];
            if (!effect) {
                console.error(`UNIMPLEMENTED EFFECT ID: ${skill.effectId} `);
                return TERMINATE;
            }
            return effect.aiEffect(skill, ctx);
        }
        exports.aiEffect = aiEffect;
        function skillType(enemyId, skillIdx) {
            const baseSkill = ilmina_stripped_8.floof.getCard(enemyId).enemySkills[skillIdx];
            const effectId = ilmina_stripped_8.floof.getEnemySkill(baseSkill.enemySkillId).internalEffectId;
            // const skill = toSkillContext(ctx.cardId, skillIdx);
            const effect = ENEMY_SKILL_GENERATORS[effectId];
            if (!effect) {
                console.error(`UNIMPLEMENTED EFFECT ID: ${effectId} `);
                return SkillType.EFFECT;
            }
            return effect.type || SkillType.EFFECT;
        }
        exports.skillType = skillType;
        function goto(ctx, skillIdx) {
            const skill = toSkillContext(ctx.cardId, skillIdx);
            const effect = ENEMY_SKILL_GENERATORS[skill.effectId];
            if (!effect) {
                console.error(`UNIMPLEMENTED EFFECT ID: ${skill.effectId} `);
                return TERMINATE;
            }
            return effect.goto(skill, ctx);
        }
        exports.goto = goto;
        function textifyEnemySkill(enemy, idx) {
            const text = textify({
                cardId: enemy.id,
                atk: enemy.atk,
                // Values needed to create context, all defaults.
                attribute: -1,
                isPreempt: false,
                lv: 10,
                hpPercent: 100,
                combo: 1,
                otherEnemyHp: 0,
                teamIds: [],
                bigBoard: false,
                charges: 0,
                flags: 0,
                counter: 0,
                teamTypes: new Set(),
                teamAttributes: new Set(),
            }, toSkillContext(enemy.id, idx));
            return text;
        }
        exports.textifyEnemySkill = textifyEnemySkill;
        function textifyEnemySkills(enemy) {
            const val = [];
            for (let i = 0; i < ilmina_stripped_8.floof.getCard(enemy.id).enemySkills.length; i++) {
                val.push(textifyEnemySkill(enemy, i));
            }
            return val;
        }
        exports.textifyEnemySkills = textifyEnemySkills;
    });
    define("dungeon", ["require", "exports", "common", "ajax", "enemy_instance", "templates", "enemy_skills", "ilmina_stripped"], function (require, exports, common_12, ajax_2, enemy_instance_1, templates_6, enemy_skills_1, ilmina_stripped_9) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class DungeonFloor {
            constructor() {
                this.activeEnemy = 0;
                this.enemies = [new enemy_instance_1.EnemyInstance()];
                this.activeEnemy = 0;
            }
            addEnemy() {
                this.enemies.push(new enemy_instance_1.EnemyInstance());
            }
            deleteEnemy(idx) {
                if (this.enemies.length <= 1 || !(idx in this.enemies)) {
                    console.log('Unable to delete enemy from floor.');
                    return;
                }
                this.enemies.splice(idx, 1);
            }
            getActiveEnemy() {
                return this.enemies[this.activeEnemy];
            }
            getEnemyIds() {
                return this.enemies.map((enemy) => enemy.id);
            }
            toJson() {
                return {
                    enemies: this.enemies.map((enemy) => enemy.toJson()),
                };
            }
            static fromJson(json) {
                const floor = new DungeonFloor();
                floor.enemies = json.enemies.map((enemy) => enemy_instance_1.EnemyInstance.fromJson(enemy));
                return floor;
            }
        }
        const requestUrl = common_12.BASE_URL + 'assets/DungeonsAndEncounters.json';
        const DUNGEON_DATA = new Map();
        const dungeonSearchArray = [];
        const request = ajax_2.ajax(requestUrl);
        let dungeonsLoaded = false;
        request.done((data) => {
            console.log('Loading Dungeon JSON data...');
            const rawData = JSON.parse(data);
            for (const datum of rawData) {
                for (const subDatum of datum.sub_dungeons) {
                    const floorsJson = [];
                    for (let i = 0; i < subDatum.floors; i++) {
                        floorsJson.push({
                            enemies: [],
                        });
                    }
                    for (const encounter of subDatum.encounters) {
                        if (encounter.stage <= 0) {
                            encounter.stage = 1;
                        }
                        if (encounter.stage > floorsJson.length) {
                            encounter.stage = floorsJson.length;
                        }
                        const floor = floorsJson[encounter.stage - 1];
                        if (!floor) {
                            console.warn('invalid floor count...');
                            continue;
                        }
                        floor.enemies.push({
                            id: encounter.enemy_id,
                            lv: encounter.level,
                        });
                    }
                    const dungeonInstanceJson = {
                        title: `${datum.name_na} - ${subDatum.name_na}`,
                        floors: floorsJson,
                        isNormal: datum.dungeon_type == 0,
                        hp: String(subDatum.hp_mult),
                        atk: String(subDatum.atk_mult),
                        def: String(subDatum.def_mult),
                    };
                    DUNGEON_DATA.set(subDatum.sub_dungeon_id, dungeonInstanceJson);
                    dungeonSearchArray.push({ s: dungeonInstanceJson.title, value: subDatum.sub_dungeon_id });
                }
            }
            dungeonsLoaded = true;
            console.log('Dungeon Data loaded.');
        });
        class DungeonInstance {
            constructor() {
                this.id = -1;
                this.title = '';
                this.boardWidth = 6;
                this.fixedTime = 0;
                this.isRogue = false; // UNIMPLEMENTED
                this.isNormal = false;
                this.allAttributesRequired = false;
                this.noDupes = false;
                this.hpMultiplier = new common_12.Rational(1);
                this.atkMultiplier = new common_12.Rational(1);
                this.defMultiplier = new common_12.Rational(1);
                this.activeFloor = 0;
                this.activeEnemy = 0;
                this.onEnemySkill = () => null;
                this.onEnemyChange = () => { };
                this.onEnemyUpdate = () => { };
                // Sets all of your monsters to level 1 temporarily.
                this.floors = [new DungeonFloor()];
                this.pane = new templates_6.DungeonPane(dungeonSearchArray, this.getUpdateFunction());
                this.skillArea = new templates_6.EnemySkillArea((idx) => {
                    this.onEnemySkill(idx, []);
                });
            }
            async loadDungeon(subDungeonId) {
                await common_12.waitFor(() => dungeonsLoaded);
                const data = DUNGEON_DATA.get(subDungeonId);
                if (!data) {
                    console.warn('invalid sub dungeon');
                    return;
                }
                this.id = subDungeonId;
                this.loadJson(data);
            }
            useEnemySkill(teamIds, teamAttrs, teamTypes, combo, bigBoard, isPreempt = false, skillIdx = -1) {
                const enemy = this.getActiveEnemy();
                const otherSkills = [];
                if (skillIdx < 0) {
                    const possibleEffects = enemy_skills_1.determineSkillset({
                        cardId: enemy.id,
                        lv: enemy.lv,
                        attribute: enemy.getAttribute(),
                        atk: enemy.getAtk(),
                        hpPercent: Math.round(enemy.currentHp / enemy.getHp() * 100),
                        charges: enemy.charges,
                        flags: enemy.flags,
                        counter: enemy.counter,
                        otherEnemyHp: enemy.otherEnemyHp,
                        isPreempt,
                        combo,
                        teamIds,
                        bigBoard,
                        teamAttributes: teamAttrs,
                        teamTypes: teamTypes,
                    });
                    if (possibleEffects.length) {
                        const totalWeight = possibleEffects.reduce((total, e) => total + e.chance, 0);
                        let roll = Math.random() * totalWeight;
                        for (const effect of possibleEffects) {
                            if (roll < effect.chance && skillIdx < 0) {
                                skillIdx = effect.idx;
                                enemy.counter = effect.counter;
                                enemy.flags = effect.flags;
                            }
                            else {
                                otherSkills.push(effect.idx);
                            }
                            roll -= effect.chance;
                        }
                    }
                    this.onEnemySkill(skillIdx, otherSkills);
                }
            }
            getEnemyMechanics(teamIds, teamAttrs, teamTypes, bigBoard, floorIdx = -1, enemyIdx = -1, preemptOnly = false, mechanics = undefined) {
                if (floorIdx < 0) {
                    floorIdx = this.activeFloor;
                }
                if (enemyIdx < 0) {
                    enemyIdx = this.activeEnemy;
                }
                const enemy = this.floors[floorIdx].enemies[enemyIdx];
                enemy.dungeonMultipliers.hp = this.hpMultiplier;
                enemy.dungeonMultipliers.atk = this.atkMultiplier;
                enemy.dungeonMultipliers.def = this.defMultiplier;
                enemy.reset();
                mechanics = mechanics || {
                    // Occurs no matter what
                    resolve: false,
                    superResolve: false,
                    skillDelay: 0,
                    skillBind: false,
                    leaderBind: false,
                    helperBind: false,
                    subBind: false,
                    hits: [],
                    timeDebuff: false,
                    rcvDebuff: false,
                    atkDebuff: false,
                    comboAbsorb: 0,
                    damageAbsorb: false,
                    attributesAbsorbed: 0,
                    damageVoid: false,
                    leaderSwap: false,
                    poisonChange: false,
                    jammerChange: false,
                    blind: false,
                    cloud: false,
                    tape: false,
                    poisonSkyfall: false,
                    jammerSkyfall: false,
                    blindSkyfall: false,
                    spinner: false,
                    awokenBind: false,
                    lock: false,
                    unmatchable: false,
                    noSkyfall: false,
                };
                mechanics.resolve = mechanics.resolve || enemy.getResolve() > 0;
                mechanics.superResolve = mechanics.superResolve || enemy.getSuperResolve().minHp > 0;
                let skills = [];
                if (preemptOnly) {
                    skills = enemy_skills_1.determineSkillset({
                        cardId: enemy.id,
                        lv: enemy.lv,
                        attribute: enemy.getAttribute(),
                        atk: enemy.getAtk(),
                        hpPercent: Math.round(enemy.currentHp / enemy.getHp() * 100),
                        charges: enemy.charges,
                        flags: enemy.flags,
                        counter: enemy.counter,
                        otherEnemyHp: enemy.otherEnemyHp,
                        isPreempt: true,
                        combo: 0,
                        teamIds,
                        bigBoard,
                        teamAttributes: teamAttrs,
                        teamTypes: teamTypes,
                    }).map((skill) => skill.idx);
                }
                else {
                    for (let i = 0; i < enemy.getCard().enemySkills.length; i++) {
                        skills.push(i);
                    }
                }
                for (const idx of skills) {
                    const enemySkill = enemy.getCard().enemySkills[idx];
                    const skill = ilmina_stripped_9.floof.getEnemySkill(enemySkill.enemySkillId);
                    enemy_skills_1.addMechanic(mechanics, enemySkill.enemySkillId, {
                        aiArgs: skill.aiArgs,
                        skillArgs: skill.skillArgs,
                        atk: enemy.getAtkBase(),
                    });
                }
                return mechanics;
            }
            getDungeonMechanics(teamIds, teamAttrs, teamTypes, bigBoard, preemptOnly = false) {
                const mechanics = {
                    resolve: false,
                    superResolve: false,
                    skillDelay: 0,
                    skillBind: false,
                    leaderBind: false,
                    helperBind: false,
                    subBind: false,
                    hits: [],
                    timeDebuff: false,
                    rcvDebuff: false,
                    atkDebuff: false,
                    comboAbsorb: 0,
                    damageAbsorb: false,
                    attributesAbsorbed: 0,
                    damageVoid: false,
                    leaderSwap: false,
                    poisonChange: false,
                    jammerChange: false,
                    blind: false,
                    cloud: false,
                    tape: false,
                    poisonSkyfall: false,
                    jammerSkyfall: false,
                    blindSkyfall: false,
                    spinner: false,
                    awokenBind: false,
                    lock: false,
                    unmatchable: false,
                    noSkyfall: false,
                };
                for (let i = 0; i < this.floors.length; i++) {
                    for (let j = 0; j < this.floors[i].enemies.length; j++) {
                        this.getEnemyMechanics(teamIds, teamAttrs, teamTypes, bigBoard, i, j, preemptOnly, mechanics);
                    }
                }
                return mechanics;
            }
            getUpdateFunction() {
                return (ctx) => {
                    console.log(ctx);
                    if (ctx.loadDungeon != undefined) {
                        this.loadDungeon(ctx.loadDungeon);
                    }
                    // const oldEnemy = {
                    //   floor: this.activeFloor,
                    //   enemy: this.activeEnemy,
                    // };
                    // const newEnemy = {
                    //   floor: this.activeFloor,
                    //   enemy: this.activeEnemy,
                    // };
                    let newEnemy = -1;
                    if (ctx.activeFloor != undefined) {
                        this.activeFloor = ctx.activeFloor;
                        // this.setActiveEnemy(0);
                        // newEnemy.floor = ctx.activeFloor;
                        // newEnemy.enemy = 0;
                        newEnemy = 0;
                    }
                    if (ctx.activeEnemy != undefined) {
                        // TODO: Centralize definition of activeEnemy into either DungeonInstace or DungeonFloor.
                        // this.setActiveEnemy(ctx.activeEnemy);
                        // newEnemy.enemy = ctx.activeEnemy;
                        newEnemy = ctx.activeEnemy;
                    }
                    if (ctx.addFloor) {
                        this.addFloor();
                        // this.setActiveEnemy(0);
                        // newEnemy.floor = this.floors.length - 1;
                        // newEnemy.enemy = 0;
                        newEnemy = 0;
                    }
                    if (ctx.removeFloor != undefined) {
                        if (ctx.removeFloor == 0) {
                            // Do nothing for now?
                        }
                        else {
                            this.deleteFloor(ctx.removeFloor);
                        }
                    }
                    if (ctx.addEnemy) {
                        const floor = this.floors[this.activeFloor];
                        floor.addEnemy();
                        // this.setActiveEnemy(floor.enemies.length - 1);
                        // newEnemy.enemy = floor.enemies.length - 1;
                        newEnemy = floor.enemies.length - 1;
                    }
                    const updateActiveEnemy = newEnemy >= 0;
                    if (updateActiveEnemy) {
                        this.setActiveEnemy(newEnemy);
                    }
                    const enemy = this.getActiveEnemy();
                    if (ctx.dungeonHpMultiplier != undefined) {
                        this.hpMultiplier = common_12.Rational.from(ctx.dungeonHpMultiplier);
                        enemy.dungeonMultipliers.hp = this.hpMultiplier;
                    }
                    if (ctx.dungeonAtkMultiplier != undefined) {
                        this.atkMultiplier = common_12.Rational.from(ctx.dungeonAtkMultiplier);
                        enemy.dungeonMultipliers.atk = this.atkMultiplier;
                    }
                    if (ctx.dungeonDefMultiplier != undefined) {
                        this.defMultiplier = common_12.Rational.from(ctx.dungeonDefMultiplier);
                        enemy.dungeonMultipliers.def = this.defMultiplier;
                    }
                    if (ctx.activeEnemy != undefined || ctx.activeFloor != undefined) {
                        // Update other dungeon info about dungeon editor.
                    }
                    if (ctx.hp != undefined) {
                        if (ctx.hp < 0) {
                            ctx.hp = 0;
                        }
                        if (ctx.hp > enemy.getHp()) {
                            ctx.hp = enemy.getHp();
                        }
                        enemy.currentHp = ctx.hp;
                    }
                    if (ctx.hpPercent != undefined) {
                        if (ctx.hpPercent < 0) {
                            ctx.hpPercent = 0;
                        }
                        if (ctx.hpPercent > 100) {
                            ctx.hpPercent = 100;
                        }
                        enemy.currentHp = Math.ceil(enemy.getHp() * ctx.hpPercent / 100);
                    }
                    if (ctx.enrage != undefined) {
                        enemy.attackMultiplier = ctx.enrage;
                    }
                    if (ctx.defBreak != undefined) {
                        enemy.ignoreDefensePercent = ctx.defBreak;
                    }
                    if (ctx.enemyLevel) {
                        this.getActiveEnemy().setLevel(ctx.enemyLevel);
                    }
                    if (ctx.activeEnemyId != undefined) {
                        this.getActiveEnemy().id = ctx.activeEnemyId;
                    }
                    if (ctx.statusShield != undefined) {
                        enemy.statusShield = ctx.statusShield;
                    }
                    if (ctx.invincible != undefined) {
                        enemy.invincible = ctx.invincible;
                    }
                    if (ctx.attribute != undefined) {
                        enemy.currentAttribute = ctx.attribute;
                    }
                    if (ctx.comboAbsorb != undefined) {
                        enemy.comboAbsorb = ctx.comboAbsorb;
                    }
                    if (ctx.damageShield != undefined) {
                        enemy.shieldPercent = ctx.damageShield;
                    }
                    if (ctx.damageAbsorb != undefined) {
                        enemy.damageAbsorb = ctx.damageAbsorb;
                    }
                    if (ctx.damageVoid != undefined) {
                        enemy.damageVoid = ctx.damageVoid;
                    }
                    if (ctx.attributeAbsorbs != undefined) {
                        enemy.attributeAbsorb = [...ctx.attributeAbsorbs];
                    }
                    if (ctx.charges != undefined) {
                        enemy.charges = ctx.charges;
                    }
                    if (ctx.counter != undefined) {
                        enemy.counter = ctx.counter;
                    }
                    if (ctx.flags != undefined) {
                        enemy.flags = ctx.flags;
                    }
                    this.update(updateActiveEnemy);
                    this.onEnemyUpdate();
                };
            }
            getPane() {
                return this.pane.getElement();
            }
            update(updateActiveEnemy) {
                this.pane.dungeonEditor.setEnemies(this.floors.map((floor) => floor.getEnemyIds()));
                if (updateActiveEnemy) {
                    const e = this.getActiveEnemy();
                    const c = e.getCard();
                    const a = e.getAtk();
                    const skillTexts = this.getActiveEnemy().getCard().enemySkills
                        .map((_, i) => ({
                        description: enemy_skills_1.textifyEnemySkill({ id: c.id, atk: a }, i),
                        active: enemy_skills_1.skillType(c.id, i) == 0,
                    }));
                    this.pane.dungeonEditor.setActiveEnemy(this.activeFloor, this.activeEnemy);
                    this.skillArea.update(skillTexts);
                }
                const enemy = this.getActiveEnemy();
                this.pane.dungeonEditor.setDungeonMultipliers(this.hpMultiplier.toString(), this.atkMultiplier.toString(), this.defMultiplier.toString());
                this.pane.dungeonEditor.setEnemyStats({
                    lv: enemy.lv,
                    currentHp: enemy.currentHp,
                    percentHp: enemy.getHpPercent(),
                    hp: Math.round(this.hpMultiplier.multiply(enemy.getHp())),
                    baseAtk: enemy.getAtkBase(),
                    enrage: enemy.attackMultiplier,
                    atk: enemy.getAtk(),
                    baseDef: enemy.getDefBase(),
                    ignoreDefensePercent: enemy.ignoreDefensePercent,
                    def: enemy.getDef(),
                    resolve: Math.round(enemy.getResolve()),
                    superResolve: enemy.getSuperResolve().minHp,
                    typeResists: enemy.getTypeResists(),
                    attrResists: enemy.getAttrResists(),
                    statusShield: enemy.statusShield,
                    comboAbsorb: enemy.comboAbsorb,
                    attribute: enemy.currentAttribute,
                    damageAbsorb: enemy.damageAbsorb,
                    damageVoid: enemy.damageVoid,
                    invincible: enemy.invincible,
                    attributeAbsorb: enemy.attributeAbsorb,
                    damageShield: enemy.shieldPercent,
                    maxCharges: enemy.getCard().charges,
                    charges: enemy.charges,
                    counter: enemy.counter,
                    flags: enemy.flags,
                });
            }
            addFloor() {
                this.floors.push(new DungeonFloor());
                this.activeFloor = this.floors.length - 1;
                // this.reloadEditorElement();
            }
            deleteFloor(idx) {
                if (this.floors.length <= 1 || !(idx in this.floors)) {
                    console.log('Unable to delete floor.');
                    return;
                }
                this.floors.splice(idx, 1);
                if (this.activeFloor >= idx) {
                    this.activeFloor = idx - 1;
                }
            }
            setActiveEnemy(idx) {
                this.activeEnemy = idx;
                this.floors[this.activeFloor].activeEnemy = idx;
                const enemy = this.getActiveEnemy();
                enemy.dungeonMultipliers = {
                    hp: this.hpMultiplier,
                    atk: this.atkMultiplier,
                    def: this.defMultiplier,
                };
                enemy.reset();
                this.onEnemyChange();
            }
            getActiveEnemy() {
                return this.floors[this.activeFloor].getActiveEnemy();
            }
            toJson() {
                const obj = {
                    title: this.title,
                    isNormal: this.isNormal,
                    floors: this.floors.map((floor) => floor.toJson()),
                };
                const hpString = this.hpMultiplier.toString();
                if (hpString != '1' && hpString != 'NaN') {
                    obj.hp = hpString;
                }
                const atkString = this.atkMultiplier.toString();
                if (atkString != '1' && atkString != 'NaN') {
                    obj.atk = atkString;
                }
                const defString = this.defMultiplier.toString();
                if (defString != '1' && defString != 'NaN') {
                    obj.def = defString;
                }
                return obj;
            }
            loadJson(json) {
                this.title = json.title || '';
                this.floors = json.floors.map((floor) => DungeonFloor.fromJson(floor));
                if (!this.floors) {
                    this.addFloor();
                }
                this.isNormal = json.isNormal;
                this.activeFloor = 0;
                this.setActiveEnemy(0);
                this.hpMultiplier = common_12.Rational.from(json.hp || '1');
                this.atkMultiplier = common_12.Rational.from(json.atk || '1');
                this.defMultiplier = common_12.Rational.from(json.def || '1');
                this.update(true);
            }
        }
        exports.DungeonInstance = DungeonInstance;
    });
    define("team_photo", ["require", "exports", "common", "ilmina_stripped", "templates"], function (require, exports, common_13, ilmina_stripped_10, templates_7) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function borderedText(ctx, text, x, y, borderThickness = -1, borderColor = 'black', color = 'yellow') {
            if (borderThickness < 0) {
                borderThickness = ctx.canvas.width / 200;
            }
            ctx.fillStyle = color;
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderThickness;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        class TitleRow {
            constructor(title) {
                this.title = title.trim();
            }
            getHeightOverWidth() {
                return this.title ? 0.07 : 0;
            }
            imagesToLoad() {
                return [];
            }
            draw(ctx, drawnOffsetY) {
                if (!this.title) {
                    return;
                }
                ctx.textAlign = 'left';
                ctx.font = `${ctx.canvas.width * 0.05}px Arial`;
                borderedText(ctx, this.title, ctx.canvas.width / 80, drawnOffsetY + ctx.canvas.width * 0.05, -1, 'black', 'white');
            }
        }
        class TeamBadgeRow {
            constructor(badge) {
                this.badge = badge;
            }
            getHeightOverWidth() {
                return 0.06;
            }
            getAssetName() {
                return `assets/badge/${this.badge}.png`;
            }
            imagesToLoad() {
                return [this.getAssetName()];
            }
            draw(ctx, drawnOffsetY, images) {
                const width = ctx.canvas.width;
                const badgeWidth = width * 0.06;
                const badgeHeight = badgeWidth * 41 / 53;
                ctx.drawImage(images[this.getAssetName()], width / 40, drawnOffsetY + width * 0.004, badgeWidth, badgeHeight);
            }
        }
        function drawMonster(ctx, id, sideLength, offsetX, offsetY, images) {
            if (id <= 0) {
                return;
            }
            const d = ilmina_stripped_10.CardAssets.getIconImageData(ilmina_stripped_10.floof.getCard(id));
            const a = ilmina_stripped_10.CardUiAssets.getIconFrame(ilmina_stripped_10.floof.getCard(id).attribute, false, ilmina_stripped_10.floof.getModel());
            ctx.drawImage(images[d.url], d.offsetX, // x coordinate to being clipping.
            d.offsetY, // y coordinate to begin clipping.
            d.width, // width of the clipped image.
            d.height, // Height of the clipped image
            offsetX, // X Coordinate on canvas.
            offsetY, // y coordinate on canvas.
            sideLength, // width of the drawn image.
            sideLength);
            if (a) {
                ctx.drawImage(images[a.url], a.offsetX, a.offsetY, a.width, a.height, offsetX, offsetY, sideLength, sideLength);
            }
            if (ilmina_stripped_10.floof.getCard(id).subattribute >= 0) {
                const s = ilmina_stripped_10.CardUiAssets.getIconFrame(ilmina_stripped_10.floof.getCard(id).subattribute, true, ilmina_stripped_10.floof.getModel());
                if (s) {
                    ctx.drawImage(images[s.url], s.offsetX, s.offsetY, s.width, s.height, offsetX, offsetY, sideLength, sideLength);
                }
            }
        }
        function drawAwakening(ctx, awakening, sideLength, offsetX, offsetY, image, opacity = 1.0) {
            const [x, y] = templates_7.getAwakeningOffsets(awakening);
            if (opacity != 1.0) {
                ctx.save();
                ctx.globalAlpha = opacity;
            }
            ctx.drawImage(image, -1 * x, -1 * y, 32, 32, offsetX, offsetY, sideLength, sideLength);
            if (opacity + 1.0) {
                ctx.restore();
            }
        }
        class InheritRow {
            constructor(inherits) {
                this.inherits = inherits;
            }
            getHeightOverWidth() {
                if (this.inherits.some(({ id }) => id > 0)) {
                    return 1 / 12;
                }
                return 0;
            }
            draw(ctx, drawnOffsetY, images) {
                const width = ctx.canvas.width;
                const inheritLength = width / 12;
                for (let i = 0; i < this.inherits.length; i++) {
                    const inherit = this.inherits[i];
                    if (inherit.id <= 0) {
                        continue;
                    }
                    const drawnOffsetX = i * 2 * inheritLength;
                    drawMonster(ctx, inherit.id, inheritLength, drawnOffsetX, drawnOffsetY, images); // TODO: Draw the text for ID, Levels, and Plusses.
                    ctx.textAlign = 'left';
                    const xStats = drawnOffsetX + inheritLength + width * 0.005;
                    ctx.font = `${width * 0.017}px Arial`;
                    borderedText(ctx, `${inherit.id}`, xStats, drawnOffsetY + inheritLength * 0.25, -1, 'black', 'white');
                    borderedText(ctx, `Lv${inherit.lv}`, xStats, drawnOffsetY + inheritLength * 0.583, -1, 'black', inherit.lv > 99 ? 'cyan' : 'white');
                    borderedText(ctx, `+${inherit.plussed ? 297 : 0}`, xStats, drawnOffsetY + inheritLength * 0.916, -1, 'black', 'white');
                }
            }
            imagesToLoad() {
                const monsterUrls = this.getIds()
                    .filter((id) => id > 0)
                    .map((id) => ilmina_stripped_10.CardAssets.getIconImageData(ilmina_stripped_10.floof.getCard(id)).url);
                const attributeBorder = ilmina_stripped_10.CardUiAssets.getIconFrame(0, false, ilmina_stripped_10.floof.getModel());
                if (attributeBorder) {
                    return monsterUrls.concat(attributeBorder.url);
                }
                return monsterUrls;
            }
            getIds() {
                return this.inherits.map((inherit) => inherit.id);
            }
        }
        class MonsterRow {
            constructor(monsters) {
                this.monsters = monsters;
            }
            getHeightOverWidth() {
                if (this.monsters.some(({ id }) => id > 0)) {
                    return 1 / 6;
                }
                return 0;
            }
            draw(ctx, drawnOffsetY, images) {
                const width = ctx.canvas.width;
                const length = width / 6;
                for (let i = 0; i < this.monsters.length; i++) {
                    const monster = this.monsters[i];
                    if (monster.id <= 0) {
                        continue;
                    }
                    const drawnOffsetX = i * length;
                    drawMonster(ctx, monster.id, length, drawnOffsetX, drawnOffsetY, images);
                    if (monster.plusses) {
                        ctx.textAlign = 'left';
                        const x = drawnOffsetX + width * 0.0075;
                        const y = drawnOffsetY + width * 0.04;
                        ctx.font = `${width * 0.033333}px Arial`;
                        borderedText(ctx, `+${monster.plusses} `, x, y);
                        ctx.fillStyle = 'black';
                    }
                    if (monster.awakenings) {
                        if (monster.awakenings >= ilmina_stripped_10.floof.getCard(monster.id).awakenings.length) {
                            ctx.drawImage(images[MonsterRow.MAX_AWOKEN_URL], 0, 0, 55, 55, drawnOffsetX + 0.7 * length, drawnOffsetY + width * .0125, length * 0.23, length * 0.23);
                        }
                        else {
                            ctx.textAlign = 'right';
                            const x = drawnOffsetX + length - width * 0.0125;
                            const y = drawnOffsetY + width * 0.04;
                            ctx.font = `${width * 0.033333}px Arial`;
                            borderedText(ctx, `(${monster.awakenings})`, x, y);
                        }
                    }
                    if (monster.superAwakeningIdx >= 0) {
                        const sa = ilmina_stripped_10.floof.getCard(monster.id).superAwakenings[monster.superAwakeningIdx];
                        if (sa != undefined) {
                            const xSa = drawnOffsetX + length * 0.7;
                            const ySa = drawnOffsetY + length * 0.375;
                            drawAwakening(ctx, sa, length * 0.25, xSa, ySa, images[MonsterRow.AWAKENING_URL]);
                        }
                    }
                    ctx.textAlign = 'left';
                    const xLevel = drawnOffsetX + width * 0.0125;
                    const yLevel = drawnOffsetY + length * 0.92;
                    ctx.font = `${width * 0.022}px Arial`;
                    borderedText(ctx, `Lv${monster.lv}`, xLevel, yLevel, -1, 'black', monster.lv > 99 ? 'cyan' : 'white');
                    ctx.textAlign = 'right';
                    const xId = drawnOffsetX + length - width * 0.0125;
                    borderedText(ctx, `${monster.id}`, xId, yLevel, -1, 'black', 'white');
                }
            }
            imagesToLoad() {
                const monsterUrls = this.getIds()
                    .filter((id) => id > 0)
                    .map((id) => ilmina_stripped_10.CardAssets.getIconImageData(ilmina_stripped_10.floof.getCard(id)).url)
                    .concat(MonsterRow.MAX_AWOKEN_URL, MonsterRow.AWAKENING_URL);
                const attributeBorder = ilmina_stripped_10.CardUiAssets.getIconFrame(0, false, ilmina_stripped_10.floof.getModel());
                if (attributeBorder) {
                    return monsterUrls.concat(attributeBorder.url);
                }
                return monsterUrls;
            }
            getIds() {
                return this.monsters.map((monster) => monster.id);
            }
        }
        MonsterRow.MAX_AWOKEN_URL = 'assets/max_awoken.png';
        MonsterRow.AWAKENING_URL = 'assets/eggs.png';
        class LatentRow {
            constructor(latents) {
                this.mostSlotsUsed = 0;
                this.latents = latents;
                for (const monsterLatents of latents) {
                    const slotsUsed = monsterLatents.reduce((total, l) => {
                        if (l < 11) {
                            return total + 1;
                        }
                        if (l < 33) {
                            return total + 2;
                        }
                        return total + 6;
                    }, 0);
                    this.mostSlotsUsed = Math.max(this.mostSlotsUsed, slotsUsed);
                }
            }
            getHeightOverWidth() {
                if (this.mostSlotsUsed == 0) {
                    return 0;
                }
                if (this.mostSlotsUsed <= 6) {
                    return 1 / 48;
                }
                // 7-8 Latents requires 2 rows.
                return 1 / 24;
            }
            imagesToLoad() {
                return [LatentRow.LATENT_URL];
            }
            draw(ctx, drawnOffsetY, images) {
                const superSize = ctx.canvas.width / 18;
                const hyperSize = 3 * superSize;
                const normalSize = superSize * LatentRow.LATENT_WIDTH / LatentRow.LATENT_WIDTH_SUPER;
                const height = ctx.canvas.width / 48;
                const maxWidth = ctx.canvas.width / 6;
                for (let i = 0; i < this.latents.length; i++) {
                    const monsterLatents = this.latents[i].sort((a, b) => b - a);
                    let localOffsetX = 0;
                    let localOffsetY = 0;
                    for (const latent of monsterLatents) {
                        let width = hyperSize;
                        let imageWidth = LatentRow.LATENT_WIDTH_HYPER;
                        if (latent < 11) {
                            width = normalSize;
                            imageWidth = LatentRow.LATENT_WIDTH;
                        }
                        else if (latent < 33) {
                            width = superSize;
                            imageWidth = LatentRow.LATENT_WIDTH_SUPER;
                        }
                        if (localOffsetX + width > maxWidth) {
                            localOffsetX = 0;
                            localOffsetY = height;
                        }
                        const { x, y } = templates_7.getLatentPosition(latent);
                        ctx.drawImage(images[LatentRow.LATENT_URL], x, y, imageWidth, 32, localOffsetX + i * ctx.canvas.width / 6, localOffsetY + drawnOffsetY, width, height);
                        localOffsetX += width;
                    }
                }
            }
        }
        LatentRow.LATENT_WIDTH = 32;
        LatentRow.LATENT_WIDTH_SUPER = 78;
        LatentRow.LATENT_WIDTH_HYPER = 78 * 3;
        LatentRow.LATENT_URL = 'assets/eggs.png';
        class AggregateAwakeningRow {
            constructor(totals) {
                this.totals = totals;
            }
            getHeightOverWidth() {
                return Math.ceil(Object.keys(this.totals).length / AggregateAwakeningRow.PER_ROW) / 20 + 1 / 20;
            }
            imagesToLoad() {
                return [MonsterRow.AWAKENING_URL];
            }
            draw(ctx, drawnOffsetY, images) {
                let verticalOffset = drawnOffsetY + ctx.canvas.width * 1 / 40;
                const sideLength = ctx.canvas.width / 6 * 0.25;
                let xOffset = ctx.canvas.width * 0.05;
                const im = images[MonsterRow.AWAKENING_URL];
                const maxOffset = ctx.canvas.width * 0.9;
                for (const { awakening, total } of this.totals) {
                    drawAwakening(ctx, awakening, sideLength, xOffset, verticalOffset, im, total ? 1.0 : 0.5);
                    const text = `x${total}`;
                    if (text.length < 4) {
                        ctx.font = `${ctx.canvas.width * 0.033}px Arial`;
                    }
                    else {
                        ctx.font = `${ctx.canvas.width * 0.025}px Arial`;
                    }
                    ctx.textAlign = 'left';
                    borderedText(ctx, text, xOffset + sideLength, verticalOffset + sideLength, -1, 'black', 'white');
                    xOffset += ctx.canvas.width / (AggregateAwakeningRow.PER_ROW + 1);
                    if (xOffset > maxOffset) {
                        xOffset = 0.05 * ctx.canvas.width;
                        verticalOffset += ctx.canvas.width / 20;
                    }
                }
            }
        }
        AggregateAwakeningRow.PER_ROW = 9;
        class CooldownRow {
            constructor(cds) {
                this.cds = [];
                for (const { base, inherit } of cds) {
                    if (base && base != inherit) {
                        this.cds.push(`${base}(${inherit})`);
                    }
                    else if (base && base == inherit) {
                        this.cds.push(`${base}`);
                    }
                    else if (!base && inherit) {
                        this.cds.push(`?(? + ${inherit})`);
                    }
                    else {
                        this.cds.push('');
                    }
                }
            }
            imagesToLoad() {
                return [];
            }
            getHeightOverWidth() {
                return CooldownRow.fontSizeFrac;
            }
            draw(ctx, drawnOffsetY) {
                drawnOffsetY += ctx.canvas.width * CooldownRow.fontSizeFrac;
                ctx.font = `${ctx.canvas.width * CooldownRow.fontSizeFrac}px Arial`;
                ctx.textAlign = 'right';
                for (let i = 0; i < this.cds.length; i++) {
                    borderedText(ctx, this.cds[i], ctx.canvas.width * ((i + 1) / 6 - 1 / 120), drawnOffsetY, -1, 'black', 'white');
                }
                ctx.textAlign = 'left';
                drawnOffsetY += ctx.canvas.width * CooldownRow.fontSizeFrac * 0.1;
                ctx.font = `${ctx.canvas.width * CooldownRow.fontSizeFrac * 0.6}px Arial`;
                borderedText(ctx, 'CD', ctx.canvas.width / 120, drawnOffsetY, -1, 'black', 'white');
            }
        }
        CooldownRow.fontSizeFrac = 1 / 30;
        class TextRow {
            constructor(text, fontSizeFrac = 1 / 30, margin = 1 / 40) {
                this.text = text;
                this.fontSizeFrac = fontSizeFrac;
                this.margin = margin;
            }
            imagesToLoad() {
                return [];
            }
            getFont(width) {
                return `${width * this.fontSizeFrac}px Arial`;
            }
            parapperTheWrapper(ctx) {
                ctx.font = this.getFont(ctx.canvas.width);
                const maxWidth = ctx.canvas.width * (1 - 2 * this.margin);
                const words = this.text.split(' ');
                let line = '';
                let currentLine = '';
                for (let i = 0; i < words.length; i++) {
                    currentLine += words[i] + ' ';
                    const width = ctx.measureText(currentLine).width;
                    if (width > maxWidth) {
                        line += '\n' + words[i] + ' ';
                        currentLine = words[i] + ' ';
                    }
                    else {
                        line += words[i] + ' ';
                    }
                }
                return line;
            }
            getHeightOverWidth() {
                const testCanvas = document.createElement('canvas');
                testCanvas.width = 1000;
                const ctx = testCanvas.getContext('2d');
                if (!ctx) {
                    return 0;
                }
                ctx.font = this.getFont(testCanvas.width);
                const wrappedText = this.parapperTheWrapper(ctx);
                return this.fontSizeFrac * wrappedText.split('\n').length;
            }
            draw(ctx, drawnOffsetY) {
                ctx.font = this.getFont(ctx.canvas.width);
                for (const line of this.parapperTheWrapper(ctx).split('\n')) {
                    drawnOffsetY += this.fontSizeFrac * ctx.canvas.width;
                    borderedText(ctx, line, ctx.canvas.width * this.margin, drawnOffsetY, -1, 'black', 'white');
                }
            }
        }
        class PaddingRow {
            constructor(frac) {
                this.frac = frac;
            }
            imagesToLoad() {
                return [];
            }
            getHeightOverWidth() {
                return this.frac;
            }
            draw() {
                return;
            }
        }
        class FancyPhoto {
            constructor() {
                this.urlsToPromises = {};
                this.loadedImages = {};
                this.rowDraws = [];
                this.opts = {
                    drawTitle: true,
                    drawBadge: true,
                    useTransform: false,
                    useLeadswap: false,
                    showCooldowns: false,
                    awakenings: [],
                    showDescription: true,
                    transparentBackground: true,
                };
                this.photoArea = new templates_7.PhotoArea(this.opts, () => {
                    this.reloadTeam();
                    this.redraw();
                });
                this.canvas = this.photoArea.getCanvas();
                this.canvas.width = 1024;
                this.ctx = this.canvas.getContext('2d');
            }
            getElement() {
                return this.photoArea.getElement();
            }
            setOptions(opts) {
                this.opts = opts;
            }
            reloadTeam() {
                if (this.lastTeam) {
                    this.loadTeam(this.lastTeam);
                }
            }
            loadTeam(team) {
                this.lastTeam = team;
                this.rowDraws.length = 0;
                if (this.opts.drawTitle) {
                    this.rowDraws.push(new TitleRow(team.teamName));
                }
                for (let i = 0; i < team.playerMode; i++) {
                    if (this.opts.drawBadge && team.playerMode != 2) {
                        this.rowDraws.push(new TeamBadgeRow(team.badges[i]));
                    }
                    team.activeTeamIdx = i;
                    const currentTeam = team.getTeamAt(i);
                    const inherits = currentTeam.map((m) => ({
                        id: m.inheritId,
                        plussed: m.inheritPlussed,
                        lv: m.inheritLevel,
                    }));
                    this.rowDraws.push(new InheritRow(inherits));
                    const monsters = currentTeam.map((m) => ({
                        id: m.getId(!this.opts.useTransform),
                        plusses: m.hpPlus + m.atkPlus + m.rcvPlus,
                        awakenings: this.opts.useTransform && m.transformedTo > 0 ? 9 : m.awakenings,
                        lv: m.level,
                        superAwakeningIdx: m.superAwakeningIdx,
                    }));
                    this.rowDraws.push(new MonsterRow(monsters));
                    this.rowDraws.push(new LatentRow(currentTeam.map((m) => m.latents)));
                    if (this.opts.showCooldowns) {
                        const cds = currentTeam.map((monster) => ({
                            base: monster.getCooldown(),
                            inherit: monster.getCooldownInherit(),
                        }));
                        this.rowDraws.push(new CooldownRow(cds));
                    }
                    if (this.opts.awakenings.length) {
                        const awakeningTotals = this.opts.awakenings.map((awakening) => {
                            // Skill Boost count only matters as the base form.
                            const ignoreTransform = !this.opts.useTransform || awakening == common_13.Awakening.SKILL_BOOST;
                            let total = team.countAwakening(awakening, { ignoreTransform, includeTeamBadge: true });
                            return { awakening, total };
                        });
                        this.rowDraws.push(new AggregateAwakeningRow(awakeningTotals));
                    }
                }
                if (this.opts.showDescription) {
                    for (const line of team.description.split('\n')) {
                        this.rowDraws.push(new TextRow(line));
                    }
                    this.rowDraws.push(new PaddingRow(1 / 40));
                }
            }
            redraw(idx = 0) {
                const heightOverWidth = this.rowDraws.reduce((total, rowDraw) => total + rowDraw.getHeightOverWidth(), 0);
                this.canvas.height = this.canvas.width * heightOverWidth;
                let aggregateOffset = 0;
                for (let i = 0; i < idx; i++) {
                    aggregateOffset += this.rowDraws[i].getHeightOverWidth() * this.canvas.width;
                }
                // this.ctx.clearRect(0, aggregateOffset, this.canvas.width, this.canvas.height - aggregateOffset);
                if (this.opts.transparentBackground) {
                    this.ctx.clearRect(0, aggregateOffset, this.canvas.width, this.canvas.height - aggregateOffset);
                }
                else {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                }
                for (const rowDraw of this.rowDraws.slice(idx)) {
                    const imageUrls = rowDraw.imagesToLoad();
                    for (const imageUrl of imageUrls) {
                        if (!this.urlsToPromises[imageUrl]) {
                            const image = document.createElement('img');
                            image.src = imageUrl;
                            image.style.display = 'none';
                            document.body.appendChild(image);
                            this.urlsToPromises[imageUrl] = new Promise((resolve) => {
                                image.onload = () => {
                                    this.loadedImages[imageUrl] = image;
                                    resolve();
                                };
                            });
                        }
                    }
                    const currentOffset = aggregateOffset;
                    Promise.all(imageUrls.map((url) => this.urlsToPromises[url])).then(() => {
                        rowDraw.draw(this.ctx, currentOffset, this.loadedImages);
                    });
                    aggregateOffset += rowDraw.getHeightOverWidth() * this.canvas.width;
                }
            }
        }
        exports.FancyPhoto = FancyPhoto;
    });
    define("url_handler", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        // Copied from: https://davidwalsh.name/query-string-javascript
        function getUrlParameter(name) {
            name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
            const matcher = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = matcher.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1]);
        }
        exports.getUrlParameter = getUrlParameter;
    });
    /**
     * Main File for Valeria.
     */
    define("valeria", ["require", "exports", "common", "combo_container", "damage_ping", "dungeon", "fuzzy_search", "player_team", "templates", "debugger", "ilmina_stripped", "custom_base64", "enemy_skills", "url_handler", "actives", "team_photo"], function (require, exports, common_14, combo_container_1, damage_ping_3, dungeon_1, fuzzy_search_3, player_team_1, templates_8, debugger_5, ilmina_stripped_11, custom_base64_1, enemy_skills_2, url_handler_1, actives_1, team_photo_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        // import { testTestTestTest } from './team_test';
        class Valeria {
            constructor() {
                this.display = new templates_8.ValeriaDisplay();
                this.comboContainer = new combo_container_1.ComboContainer();
                this.display.leftTabs.getTab('Combo Editor').appendChild(this.comboContainer.getElement());
                this.comboContainer.onUpdate.push(() => {
                    this.team.action = -1;
                    this.updateDamage();
                });
                this.monsterEditor = new templates_8.MonsterEditor((ctx) => {
                    if (ctx.playerMode) {
                        this.team.setPlayerMode(ctx.playerMode);
                        this.team.update();
                        return;
                    }
                    if (ctx.badge != undefined) {
                        this.team.badges[this.team.activeTeamIdx] = ctx.badge;
                        this.team.update();
                        return;
                    }
                    const monster = this.team.monsters[this.team.activeMonster];
                    if (ctx.level) {
                        monster.level = ctx.level;
                    }
                    if (ctx.inheritLevel) {
                        monster.inheritLevel = ctx.inheritLevel;
                    }
                    if (ctx.hpPlus != undefined) {
                        monster.setHpPlus(ctx.hpPlus);
                    }
                    if (ctx.atkPlus != undefined) {
                        monster.setAtkPlus(ctx.atkPlus);
                    }
                    if (ctx.rcvPlus != undefined) {
                        monster.setRcvPlus(ctx.rcvPlus);
                    }
                    if (ctx.inheritPlussed != undefined) {
                        monster.inheritPlussed = ctx.inheritPlussed;
                    }
                    if (ctx.awakeningLevel != undefined) {
                        monster.awakenings = ctx.awakeningLevel;
                    }
                    if (ctx.superAwakeningIdx != undefined) {
                        monster.superAwakeningIdx = ctx.superAwakeningIdx;
                    }
                    if (ctx.id != undefined) {
                        monster.setId(ctx.id);
                    }
                    if (ctx.inheritId != undefined) {
                        monster.inheritId = ctx.inheritId;
                    }
                    if (ctx.addLatent != undefined) {
                        monster.addLatent(ctx.addLatent);
                    }
                    if (ctx.removeLatent != undefined) {
                        monster.removeLatent(ctx.removeLatent);
                    }
                    this.team.update();
                    this.updateMonsterEditor();
                });
                this.monsterEditor.pdchu.importButton.onclick = () => {
                    this.team.fromPdchu(this.monsterEditor.pdchu.io.value);
                };
                this.monsterEditor.pdchu.exportButton.onclick = () => {
                    this.monsterEditor.pdchu.io.value = this.team.toPdchu();
                    const els = document.getElementsByClassName(templates_8.ClassNames.PDCHU_IO);
                    if (els.length) {
                        const el = els[0];
                        el.focus();
                        el.select();
                    }
                };
                this.monsterEditor.pdchu.exportUrlButton.onclick = () => {
                    const searchlessUrl = location.href.replace(location.search, '');
                    this.monsterEditor.pdchu.io.value = `${searchlessUrl}?team=${custom_base64_1.ValeriaEncode(this.team)}&dungeon=${this.dungeon.id}`;
                    const els = document.getElementsByClassName(templates_8.ClassNames.PDCHU_IO);
                    if (els.length) {
                        const el = els[0];
                        el.focus();
                        el.select();
                    }
                };
                this.display.leftTabs.getTab('Monster Editor').appendChild(this.monsterEditor.getElement());
                this.team = new player_team_1.Team();
                this.team.updateCb = () => {
                    this.updateMonsterEditor();
                    this.updateDamage();
                };
                this.team.onSelectMonster = () => {
                    this.display.leftTabs.setActiveTab('Monster Editor');
                };
                this.team.teamPane.applyActionButton.onclick = () => {
                    const action = this.team.action;
                    const { endEnemyHp, healing } = this.updateDamage();
                    if (action == -1) {
                        this.dungeon.getActiveEnemy().setHp(endEnemyHp);
                        this.team.heal(healing);
                        this.team.update();
                        this.dungeon.update(false);
                        return;
                    }
                    this.team.setAction(-1);
                    this.dungeon.getActiveEnemy().setHp(endEnemyHp);
                    const team = this.team.getActiveTeam();
                    const source = team[Math.floor(action / 2)];
                    const activeId = ilmina_stripped_11.floof.getCard(action & 1 ? source.inheritId : source.getId()).activeSkillId;
                    const enemy = this.dungeon.getActiveEnemy();
                    actives_1.teamEffect(activeId, {
                        source,
                        enemy,
                        team: this.team,
                        comboContainer: this.comboContainer,
                    });
                    actives_1.enemyEffect(activeId, {
                        source,
                        enemy,
                        awakeningsActive: this.team.state.awakenings,
                        playerMode: this.team.playerMode,
                    });
                    actives_1.boardEffect(activeId, this.comboContainer);
                    this.comboContainer.update();
                    this.updateDamage();
                    this.team.update();
                    this.dungeon.update(false);
                };
                let team = url_handler_1.getUrlParameter('team');
                if (team) {
                    const { pdchu, badges } = custom_base64_1.ValeriaDecodeToPdchu(team);
                    team = pdchu;
                    this.team.badges = badges;
                }
                else {
                    team = '';
                }
                this.team.fromPdchu(team);
                this.display.panes[1].appendChild(this.team.teamPane.getElement());
                this.dungeon = new dungeon_1.DungeonInstance();
                const dungeonId = url_handler_1.getUrlParameter('dungeon');
                if (dungeonId) {
                    this.dungeon.loadDungeon(Number(dungeonId));
                }
                this.display.panes[2].appendChild(this.dungeon.getPane());
                this.comboContainer.boardWidthTeam = () => this.team.getBoardWidth();
                this.comboContainer.boardWidthDungeon = () => {
                    if (this.dungeon.title.includes('7x6')) {
                        return 7;
                    }
                    if (this.dungeon.title.includes('5x4')) {
                        return 5;
                    }
                    return 6;
                };
                debugger_5.debug.addButton('Print Skills', () => {
                    const enemy = this.dungeon.getActiveEnemy();
                    const id = enemy.id;
                    const skillTexts = enemy_skills_2.textifyEnemySkills({
                        id,
                        atk: enemy.getAtk(),
                    });
                    for (let i = 0; i < skillTexts.length; i++) {
                        debugger_5.debug.print(`${i + 1}: ${skillTexts[i]} `);
                    }
                });
                debugger_5.debug.addButton('Simulate Next Skill', () => {
                    const attributes = new Set();
                    const types = new Set();
                    for (const m of this.team.getActiveTeam()) {
                        for (const type of m.getCard().types) {
                            types.add(type);
                        }
                        attributes.add(m.getAttribute());
                        attributes.add(m.getSubattribute());
                    }
                    this.dungeon.useEnemySkill(this.team.getActiveTeam().map((m) => m.getId()), // teamIds
                    attributes, types, this.comboContainer.comboCount(), // combo
                    this.comboContainer.boardWidth() == 7);
                });
                this.dungeon.onEnemySkill = (idx, otherIdxs) => {
                    if (idx < 0) {
                        debugger_5.debug.print('No skill to use');
                        return;
                    }
                    const enemy = this.dungeon.getActiveEnemy();
                    if (otherIdxs.length) {
                        debugger_5.debug.print(`  * Not using potential skills: ${otherIdxs}`);
                    }
                    debugger_5.debug.print('** Using the following skill **');
                    debugger_5.debug.print(enemy_skills_2.textifyEnemySkill({ id: enemy.id, atk: enemy.getAtk() }, idx));
                    const skillCtx = enemy_skills_2.toSkillContext(enemy.id, idx);
                    enemy_skills_2.effect(skillCtx, { enemy, team: this.team, comboContainer: this.comboContainer });
                    enemy.charges -= ilmina_stripped_11.floof.getEnemySkill(enemy.getCard().enemySkills[idx].enemySkillId).aiArgs[3];
                    enemy.charges += enemy.getCard().chargeGain;
                    this.dungeon.update(true);
                    this.team.updateState({});
                };
                this.dungeon.onEnemyChange = () => {
                    if (templates_8.SETTINGS.getBool(common_14.BoolSetting.RESET_STATE)) {
                        this.team.resetState();
                    }
                    if (!this.dungeon.isNormal && templates_8.SETTINGS.getBool(common_14.BoolSetting.USE_PREEMPT)) {
                        this.usePreempt();
                    }
                    this.updateDamage();
                };
                this.dungeon.onEnemyUpdate = () => {
                    this.updateDamage();
                };
                this.fancyPhoto = new team_photo_1.FancyPhoto();
                debugger_5.debug.addButton('Enemy Preemptive Mechanics', () => {
                    const attributes = new Set();
                    const types = new Set();
                    for (const m of this.team.getActiveTeam()) {
                        for (const type of m.getCard().types) {
                            types.add(type);
                        }
                        attributes.add(m.getAttribute());
                        attributes.add(m.getSubattribute());
                    }
                    const mechanics = this.dungeon.getEnemyMechanics(this.team.getActiveTeam().map((m) => m.getId()), // teamIds
                    attributes, types, this.team.getBoardWidth() == 7, // bigBoard
                    -1, -1, true);
                    debugger_5.debug.print(JSON.stringify(mechanics, null, 2));
                });
                debugger_5.debug.addButton('Preemptive Mechanic List', () => {
                    const attributes = new Set();
                    const types = new Set();
                    for (const m of this.team.getActiveTeam()) {
                        for (const type of m.getCard().types) {
                            types.add(type);
                        }
                        attributes.add(m.getAttribute());
                        attributes.add(m.getSubattribute());
                    }
                    const mechanics = this.dungeon.getDungeonMechanics(this.team.getActiveTeam().map((m) => m.getId()), // teamIds
                    attributes, types, this.team.getBoardWidth() == 7, // bigBoard
                    true);
                    debugger_5.debug.print(JSON.stringify(mechanics, null, 2));
                });
            }
            drawTeam() {
                this.fancyPhoto.loadTeam(this.team);
                this.fancyPhoto.redraw();
            }
            usePreempt() {
                const attributes = new Set();
                const types = new Set();
                for (const m of this.team.getActiveTeam()) {
                    for (const type of m.getCard().types) {
                        types.add(type);
                    }
                    attributes.add(m.getAttribute());
                    attributes.add(m.getSubattribute());
                }
                this.dungeon.useEnemySkill(this.team.getActiveTeam().map((m) => m.getId()), // teamIds
                attributes, types, this.comboContainer.comboCount(), // combo
                this.team.getBoardWidth() == 7, // bigBoard
                true);
            }
            updateMonsterEditor() {
                const monster = this.team.monsters[this.team.activeMonster];
                this.monsterEditor.update({
                    mode: this.team.playerMode,
                    badge: this.team.getBadge(),
                    id: monster.getId(),
                    inheritId: monster.inheritId,
                    level: monster.level,
                    hpPlus: monster.hpPlus,
                    atkPlus: monster.atkPlus,
                    rcvPlus: monster.rcvPlus,
                    awakeningLevel: monster.transformedTo > 0 ? 9 : monster.awakenings,
                    inheritLevel: monster.inheritLevel,
                    inheritPlussed: monster.inheritPlussed,
                    latents: monster.latents,
                    superAwakeningIdx: monster.superAwakeningIdx,
                });
            }
            updateDamage() {
                let pings = [];
                let healing = 0;
                let trueBonusAttack = 0;
                if (this.team.action == -1) {
                    const damageCombosInfo = this.team.getDamageCombos(this.comboContainer);
                    pings = damageCombosInfo.pings;
                    healing = damageCombosInfo.healing;
                    trueBonusAttack = damageCombosInfo.trueBonusAttack;
                }
                else {
                    const team = this.team.getActiveTeam();
                    const source = team[Math.floor(this.team.action / 2)];
                    const id = this.team.action & 1 ? source.inheritId : source.getId();
                    const activeId = ilmina_stripped_11.floof.getCard(id).activeSkillId;
                    pings = actives_1.damage(activeId, {
                        source,
                        team,
                        enemy: this.dungeon.getActiveEnemy(),
                        awakeningsActive: this.team.state.awakenings,
                        playerMode: this.team.playerMode,
                        currentHp: this.team.state.currentHp,
                        maxHp: this.team.getHp(),
                        badge: this.team.badges[this.team.activeTeamIdx],
                    });
                }
                if (!this.dungeon)
                    return { endEnemyHp: 0, healing: 0 };
                const enemy = this.dungeon.getActiveEnemy();
                let currentHp = enemy.currentHp;
                const maxHp = enemy.getHp();
                let minHp = enemy.getResolve() && enemy.getHpPercent() >= enemy.getResolve() ? 1 : 0;
                const superResolve = enemy.getSuperResolve().triggersAt < enemy.getHpPercent() ? enemy.getSuperResolve().minHp * maxHp / 100 : 0;
                if (superResolve) {
                    minHp = superResolve;
                }
                for (const ping of pings) {
                    let oldHp = currentHp;
                    ping.rawDamage = enemy.calcDamage(ping, pings, this.comboContainer, this.team.playerMode, this.team.state.awakenings, {
                        attributeAbsorb: this.team.state.voidAttributeAbsorb,
                        damageVoid: this.team.state.voidDamageVoid,
                        damageAbsorb: this.team.state.voidDamageAbsorb,
                    });
                    currentHp -= ping.rawDamage;
                    if (currentHp < minHp) {
                        currentHp = minHp;
                    }
                    if (currentHp > maxHp) {
                        currentHp = maxHp;
                    }
                    ping.actualDamage = oldHp - currentHp;
                }
                const specialPing = new damage_ping_3.DamagePing(this.team.getActiveTeam()[0], common_14.Attribute.FIXED, false);
                specialPing.damage = trueBonusAttack;
                specialPing.isActive = true;
                specialPing.rawDamage = enemy.calcDamage(specialPing, [], this.comboContainer, this.team.playerMode, false, {
                    attributeAbsorb: this.team.state.voidAttributeAbsorb,
                    damageVoid: this.team.state.voidDamageVoid,
                    damageAbsorb: this.team.state.voidDamageAbsorb,
                });
                minHp = enemy.getResolve() && (100 * currentHp / maxHp) >= enemy.getResolve() ? 1 : 0;
                const superResolveRound2 = enemy.getSuperResolve().triggersAt < (currentHp / maxHp * 100) ? superResolve : 0;
                minHp = superResolveRound2 || minHp;
                const oldHp = currentHp;
                currentHp -= specialPing.rawDamage;
                if (currentHp < minHp) {
                    currentHp = minHp;
                }
                if (currentHp > maxHp) {
                    currentHp = maxHp;
                }
                specialPing.actualDamage = oldHp - currentHp;
                if (specialPing.actualDamage) {
                    pings = [...pings, specialPing];
                }
                this.team.teamPane.updateDamage(this.team.action, pings.map((ping) => ({ attribute: ping ? ping.attribute : common_14.Attribute.NONE, damage: ping ? ping.damage : 0 })), pings.map((ping) => ({ attribute: ping ? ping.attribute : common_14.Attribute.NONE, damage: ping ? ping.rawDamage : 0 })), pings.map((ping) => ({ attribute: ping ? ping.attribute : common_14.Attribute.NONE, damage: ping ? ping.actualDamage : 0 })), maxHp, healing);
                return { endEnemyHp: currentHp, healing };
            }
            getElement() {
                return this.display.getElement();
            }
        }
        async function init() {
            await common_14.waitFor(() => ilmina_stripped_11.floof.ready);
            console.log('Valeria taking over.');
            fuzzy_search_3.SearchInit();
            const valeria = new Valeria();
            const loadingEl = document.getElementById('valeria-load');
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }
            document.body.appendChild(valeria.getElement());
            document.body.appendChild(valeria.dungeon.skillArea.getElement());
            valeria.team.teamPane.metaTabs.getTab('Photo').appendChild(valeria.fancyPhoto.getElement());
            const photoTabLabel = valeria.team.teamPane.metaTabs.getTabLabel('Photo');
            photoTabLabel.onclick = () => {
                valeria.team.teamPane.metaTabs.setActiveTab('Photo');
                valeria.drawTeam();
            };
            if (templates_8.SETTINGS.getBool(common_14.BoolSetting.DEBUG_AREA)) {
                document.body.appendChild(debugger_5.debug.getElement());
            }
            window.valeria = valeria;
            const el = document.getElementById(`valeria-player-mode-${valeria.team.playerMode}`);
            el.checked = true;
            window.onbeforeunload = () => {
                if (valeria.team.hasChange() && templates_8.SETTINGS.getBool(common_14.BoolSetting.WARN_CLOSE)) {
                    return true;
                }
            };
        }
        init();
    });
    //# sourceMappingURL=bundle.js.map
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            const dependencies = ['exports'];
            const factory = (exports) => {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies, factory };
        }
    }
    const instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        const define = get_define(name);
        instances[name] = {};
        const dependencies = define.dependencies.map(name => resolve(name));
        define.factory(...dependencies);
        const exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();