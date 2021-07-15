var PokedexMovePanel = PokedexResultPanel.extend({
	initialize: function(id) {
		id = toID(id);
		var move = Dex.moves.get(id);
		this.id = id;
		this.shortTitle = move.name;

		var buf = '<div class="pfx-body dexentry">';

		buf += '<a href="/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
		buf += '<h1><a href="/moves/'+id+'" data-target="push" class="subtle">'+move.name+'</a></h1>';

		if (move.id === 'magikarpsrevenge') {
			buf += '<div class="warning"><strong>Note:</strong> Made for testing on Pok&eacute;mon Showdown, not a real move.</div>';
		} else if (move.isNonstandard) {
			buf += '<div class="warning"><strong>Note:</strong> ';
			switch (move.isNonstandard) {
			case 'Past':
				buf += 'This move is only available in past generations.';
				break;
			case 'Future':
				buf += 'This move is only available in future generations.';
				break;
			case 'Unobtainable':
				if (move.isMax) {
					buf += 'This move can\'t be learned normally, it can only be used by ' + (move.isMax === true ? 'Dynamaxing' : 'Gigantamaxing') + '.';
				} else if (move.isZ) {
					buf += 'This move can\'t be learned normally, it can only be used with a Z-Crystal.';
				} else {
					buf += 'This move can\'t be learned normally.';
				}
				break;
			case 'CAP':
				buf += 'This is a made-up move by <a href="http://www.smogon.com/cap/" target="_blank">Smogon CAP</a>.';
				break;
			case 'LGPE':
				buf += 'This move is only available in Let\'s Go! Pikachu and Eevee.';
				break;
			case 'Custom':
				buf += 'This is a custom move, not available during normal gameplay.';
				break;
			}
			buf += '</div>';
		}

		buf += '<dl class="movetypeentry">';
		buf += '<dt>Type:</dt> <dd>';
		buf += '<a class="type '+toID(move.type)+'" href="/types/'+toID(move.type)+'" data-target="push">'+move.type+'</a> ';
		buf += '<a class="type '+toID(move.category)+'" href="/categories/'+toID(move.category)+'" data-target="push">'+move.category+'</a>';
		buf += '</dd></dl>';

		if (move.category !== 'Status') {
			buf += '<dl class="powerentry"><dt>Base power:</dt> <dd><strong>'+(move.basePower||'&mdash;')+'</strong></dd></dl>';
		}
		buf += '<dl class="accuracyentry"><dt>Accuracy:</dt> <dd>'+(move.accuracy && move.accuracy!==true?move.accuracy+'%':'&mdash;')+'</dd></dl>';
		buf += '<dl class="ppentry"><dt>PP:</dt> <dd>'+(move.pp)+(move.pp>1 ? ' <small class="minor">(max: '+(8/5*move.pp)+')</small>' : '')+'</dd>';
		buf += '</dl><div style="clear:left;padding-top:1px"></div>';

		if (move.isZ) {
			buf += '<p><strong><a href="/tags/zmove" data-target="push">[Z-Move]</a></strong>';
			if (move.isZ !== true) {
				var zItem = Dex.items.get(move.isZ);
				buf += ' requiring <a href="/items/' + zItem.id + '" data-target="push">' + zItem.name + '</a>';
			}
			buf += '</p>';
		} else if (move.isMax) {
			if (move.isMax !== true) {
				buf += '<p><strong><a href="/tags/gmaxmove" data-target="push">[G-Max Move]</a></strong>';
				var maxUser = Dex.species.get(move.isMax);
				buf += ' used by <a href="/pokemon/' + maxUser.id + 'gmax" data-target="push">' + maxUser.name + '-Gmax</a>';
				if (maxUser.name === "Toxtricity") {
					buf += ' or <a href="/pokemon/' + maxUser.id + 'lowkeygmax" data-target="push">' + maxUser.name + '-Low-Key-Gmax</a>';
				}
			} else {
				buf += '<p><strong><a href="/tags/maxmove" data-target="push">[Max Move]</a></strong>';
			}
		}

		if (move.priority > 1) {
			buf += '<p>Nearly always moves first <em>(priority +' + move.priority + ')</em>.</p>';
		} else if (move.priority <= -1) {
			buf += '<p>Nearly always moves last <em>(priority &minus;' + (-move.priority) + ')</em>.</p>';
		} else if (move.priority === 1) {
			buf += '<p>Usually moves first <em>(priority +' + move.priority + ')</em>.</p>';
		}

		buf += '<p>'+Dex.escapeHTML(move.desc||move.shortDesc)+'</p>';

		if ('defrost' in move.flags) {
			buf += '<p><a class="subtle" href="/tags/defrost" data-target="push">The user thaws out</a> if it is frozen.</p>';
		}
		if (!('protect' in move.flags) && move.target !== 'self') {
			buf += '<p class="movetag"><a href="/tags/bypassprotect" data-target="push">Bypasses Protect</a> <small>(bypasses <a class="subtle" href="/moves/protect" data-target="push">Protect</a>, <a class="subtle" href="/moves/detect" data-target="push">Detect</a>, <a class="subtle" href="/moves/kingsshield" data-target="push">King\'s Shield</a>, and <a class="subtle" href="/moves/spikyshield" data-target="push">Spiky Shield</a>)</small></p>';
		}
		if ('authentic' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/bypasssub" data-target="push">Bypasses Substitute</a> <small>(bypasses but does not break a <a class="subtle" href="/moves/substitute" data-target="push">Substitute</a>)</small></p>';
		}
		if (!('reflectable' in move.flags) && move.target !== 'self' && move.category === 'Status') {
			buf += '<p class="movetag"><a href="/tags/nonreflectable" data-target="push">&#x2713; Nonreflectable</a> <small>(can\'t be bounced by <a class="subtle" href="/moves/magiccoat" data-target="push">Magic Coat</a> or <a class="subtle" href="/abilities/magicbounce" data-target="push">Magic Bounce</a>)</small></p>';
		}
		if (!('mirror' in move.flags) && move.target !== 'self') {
			buf += '<p class="movetag"><a href="/tags/nonmirror" data-target="push">&#x2713; Nonmirror</a> <small>(can\'t be copied by <a class="subtle" href="/moves/mirrormove" data-target="push">Mirror Move</a>)</small></p>';
		}
		if (!('snatch' in move.flags) && (move.target === 'self' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf')) {
			buf += '<p class="movetag"><a href="/tags/nonsnatchable" data-target="push">&#x2713; Nonsnatchable</a> <small>(can\'t be copied by <a class="subtle" href="/moves/snatch" data-target="push">Snatch</a>)</small></p>';
		}

		if ('contact' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/contact" data-target="push">&#x2713; Contact</a> <small>(affected by many abilities like Iron Barbs and moves like Spiky Shield)</small></p>';
		}
		if ('sound' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/sound" data-target="push">&#x2713; Sound</a> <small>(bypasses <a class="subtle" href="/moves/substitute" data-target="push">Substitute</a>, doesn\'t affect <a class="subtle" href="/abilities/soundproof" data-target="push">Soundproof</a> pokemon)</small></p>';
		}
		if ('powder' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/powder" data-target="push">&#x2713; Powder</a> <small>(doesn\'t affect <a class="subtle" href="/types/grass" data-target="push">Grass</a>-types, <a class="subtle" href="/abilities/overcoat" data-target="push">Overcoat</a> pokemon, and <a class="subtle" href="/items/safetygoggles" data-target="push">Safety Goggles</a> holders)</small></p>';
		}
		if ('punch' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/fist" data-target="push">&#x2713; Fist</a> <small>(boosted by <a class="subtle" href="/abilities/ironfist" data-target="push">Iron Fist</a>)</small></p>';
		}
		if ('pulse' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/pulse" data-target="push">&#x2713; Pulse</a> <small>(boosted by <a class="subtle" href="/abilities/megalauncher" data-target="push">Mega Launcher</a>)</small></p>';
		}
		if ('bite' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/bite" data-target="push">&#x2713; Bite</a> <small>(boosted by <a class="subtle" href="/abilities/strongjaw" data-target="push">Strong Jaw</a>)</small></p>';
		}
		if ('bullet' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/ballistic" data-target="push">&#x2713; Ballistic</a> <small>(doesn\'t affect <a class="subtle" href="/abilities/bulletproof" data-target="push">Bulletproof</a> pokemon)</small></p>';
		}
		if ('kick' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/kick" data-target="push">&#x2713; Kick</a> <small>(boosted by <a class="subtle" href="/abilities/striker" data-target="push">Striker</a>)</small></p>';
		}
		if ('blade' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/blade" data-target="push">&#x2713; Blade</a> <small>(boosted by <a class="subtle" href="/abilities/blademaster" data-target="push">Blademaster</a>)</small></p>';
		}
		if ('bone' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/bone" data-target="push">&#x2713; Bone</a> <small>(affected by <a class="subtle" href="/abilities/bonezone" data-target="push">Bone Zone</a>)</small></p>';
		}

		if (move.target === 'allAdjacent') {
			buf += '<p class="movetag"><small>In Doubles, hits all adjacent Pokémon (including allies)</small></p>';
		} else if (move.target === 'allAdjacentFoes') {
			buf += '<p class="movetag"><small>In Doubles, hits all adjacent foes</small></p>';
		} else if (move.target === 'randomNormal') {
			buf += '<p class="movetag"><small>In Doubles, hits a random foe (you can\'t choose its target)</small></p>';
		} else if (move.target === 'adjacentAllyOrSelf') {
			buf += '<p class="movetag"><small>In Doubles, can be used either on the user or an adjacent ally</small></p>';
		}

		// Z-Move
		var zMoveTable = {
			Poison: "Acid Downpour",
			Fighting: "All-Out Pummeling",
			Dark: "Black Hole Eclipse",
			Grass: "Bloom Doom",
			Normal: "Breakneck Blitz",
			Rock: "Continental Crush",
			Steel: "Corkscrew Crash",
			Dragon: "Devastating Drake",
			Electric: "Gigavolt Havoc",
			Water: "Hydro Vortex",
			Fire: "Inferno Overdrive",
			Ghost: "Never-Ending Nightmare",
			Bug: "Savage Spin-Out",
			Psychic: "Shattered Psyche",
			Ice: "Subzero Slammer",
			Flying: "Supersonic Skystrike",
			Ground: "Tectonic Rage",
			Fairy: "Twinkle Tackle",
		};
		var zMoveVersionTable = {
			spiritshackle: "Sinister Arrow Raid",
			volttackle: "Catastropika",
			lastresort: "Extreme Evoboost",
			psychic: "Genesis Supernova",
			naturesmadness: "Guardian of Alola",
			darkestlariat: "Malicious Moonsault",
			sparklingaria: "Oceanic Operetta",
			gigaimpact: "Pulverizing Pancake",
			spectralthief: "Soul-Stealing 7-Star Strike",
			thunderbolt: "Stoked Sparksurfer",
			thunderbolt2: "10,000,000 Volt Thunderbolt",
			photongeyser: "Light That Burns the Sky",
			sunsteelstrike: "Searing Sunraze Smash",
			moongeistbeam: "Menacing Moonraze Maelstrom",
			playrough: "Let's Snuggle Forever",
			stoneedge: "Splintered Stormshards",
			clangingscales: "Clangorous Soulblaze",
		};
		if (!move.isMax && (move.zMovePower || move.zMoveEffect || move.zMoveBoost)) {
			buf += '<h3>Z-Move(s)</h3>';
			if (move.zMovePower) {
				buf += '<p><strong><a href="/moves/' + toID(zMoveTable[move.type]) + '" data-target="push">';
				buf += zMoveTable[move.type];
				buf += '</a></strong>: ';
				buf += '' + move.zMovePower + ' base power, ' + move.category + '</p>';
			}
			if (move.zMoveBoost) {
				buf += '<p><strong>Z-' + move.name + '</strong>: ';
				var isFirst = true;
				for (var i in move.zMoveBoost) {
					if (!isFirst) buf += ', ';
					isFirst = false;
					buf += '+' + move.zMoveBoost[i] + ' ' + (BattleStatNames[i] || i);
				}
				buf += ', then uses ' + move.name + '</p>';
			}
			if (move.zMoveEffect === 'heal') {
				buf += '<p><strong>Z-' + move.name + '</strong>: fully heals the user, then uses ' + move.name + '</p>';
			} else if (move.zMoveEffect === 'clearnegativeboost') {
				buf += '<p><strong>Z-' + move.name + '</strong>: clears the user\'s negative stat boosts, then uses ' + move.name + '</p>';
			} else if (move.zMoveEffect === 'healreplacement') {
				buf += '<p><strong>Z-' + move.name + '</strong>: uses ' + move.name + ', then heals the replacement' + '</p>';
			} else if (move.zMoveEffect === 'crit2') {
				buf += '<p><strong>Z-' + move.name + '</strong>: increases the user\'s crit rate by 2, then uses ' + move.name + '</p>';
			} else if (move.zMoveEffect === 'redirect') {
				buf += '<p><strong>Z-' + move.name + '</strong>: redirects opponent\'s moves to the user (like Follow Me) in doubles, then uses ' + move.name + '</p>';
			} else if (move.zMoveEffect === 'curse') {
				buf += '<p><strong>Z-' + move.name + '</strong>: +1 Atk if the user is a ghost, or fully heals the user otherwise, then uses ' + move.name + '</p>';
			}
			if (id in zMoveVersionTable) {
				var zMove = Dex.moves.get(zMoveVersionTable[id]);
				buf += '<p><strong><a href="/moves/' + zMove.id + '" data-target="push">' + zMove.name + '</a></strong>: ';
				if (zMove.basePower) {
					buf += '' + zMove.basePower + ' base power, ' + zMove.category + '</p>';
				} else {
					buf += zMove.shortDesc;
				}
				buf += '</p>';
			}
			if ((id + '2') in zMoveVersionTable) {
				var zMove = Dex.moves.get(zMoveVersionTable[id + '2']);
				buf += '<p><strong><a href="/moves/' + zMove.id + '" data-target="push">' + zMove.name + '</a></strong>: ';
				if (zMove.basePower) {
					buf += '' + zMove.basePower + ' base power, ' + zMove.category + '</p>';
				} else {
					buf += zMove.shortDesc;
				}
				buf += '</p>';
			}
		}

		// Max Move
		var maxMoveTable = {
			Poison: "Ooze",
			Fighting: "Knuckle",
			Dark: "Darkness",
			Grass: "Overgrowth",
			Normal: "Strike",
			Rock: "Rockfall",
			Steel: "Steelspike",
			Dragon: "Wyrmwind",
			Electric: "Lightning",
			Water: "Geyser",
			Fire: "Flare",
			Ghost: "Phantasm",
			Bug: "Flutterby",
			Psychic: "Mindstorm",
			Ice: "Hailstorm",
			Flying: "Airstream",
			Ground: "Quake",
			Fairy: "Starfall",
			Status: "Guard",
		};
		var gmaxMoveTable = {
			Bug: ["Befuddle"],
			Fire: ["Centiferno", "Wildfire"],
			Fighting: ["Chi Strike"],
			Normal: ["Cuddle", "Gold Rush", 'Replenish'],
			Dragon: ["Depletion"],
			Fairy: ["Finale", "Smite"],
			Water: ["Foam Burst", "Stonesurge"],
			Psychic: ["Gravitas"],
			Poison: ["Malodor"],
			Steel: ["Meltdown", "Steelsurge"],
			Ice: ["Resonance"],
			Ground: ["Sandblast"],
			Dark: ["Snooze"],
			Electric: ["Stun Shock", "Volt Crash"],
			Grass: ["Sweetness", "Tartness"],
			Ghost: ["Terror"],
			Rock: ["Volcalith"],
			Flying: ["Wind Rage"],
		};
		if (move.gmaxPower && !move.isZ && !move.isMax) {
			buf += '<h3>Max Move</h3>';
			if (move.category !== 'Status') {
				buf += '<p><strong><a href="/moves/max' + toID(maxMoveTable[move.type]) + '" data-target="push">';
				buf += 'Max ' + maxMoveTable[move.type];
				buf += '</a></strong>: ';
				buf += '' + move.gmaxPower + ' base power, ' + move.category + '</p>';
			} else {
				buf += '<p><strong><a href="/moves/maxguard" data-target="push">';
				buf += 'Max Guard';
				buf += '</a></strong>';
				buf += move.shortDesc;
			}
			if (move.type in gmaxMoveTable && move.category !== 'Status') {
				for (let i = 0; i < gmaxMoveTable[move.type].length; i++) {
					var gmaxMove = Dex.moves.get('gmax' + gmaxMoveTable[move.type][i]);
					buf += '<p>Becomes <strong><a href="/moves/' + gmaxMove.id + '" data-target="push">' + gmaxMove.name + '</a></strong> ';
					buf += 'if used by <strong><a href="/pokemon/' + gmaxMove.isMax + 'gmax" data-target="push">' + gmaxMove.isMax + '-Gmax</a></strong>';
					if (gmaxMove.isMax === 'Toxtricity') {
						buf += ' or <strong><a href="/pokemon/' + gmaxMove.isMax + 'lowkeygmax" data-target="push">' + gmaxMove.isMax + '-Low-Key-Gmax</a></strong>';
					}
					buf += '</p>';
				}
			}
		}

		// getting it
		// warning: excessive trickiness
		var leftPanel = this.app.panels[this.app.panels.length - 2];
		if (leftPanel && leftPanel.fragment.slice(0, 8) === 'pokemon/') {
			var pokemon = Dex.species.get(leftPanel.id);
			var learnset = BattleLearnsets[pokemon.id] && BattleLearnsets[pokemon.id].learnset;
			if (!learnset) learnset = BattleLearnsets[toID(pokemon.baseSpecies)].learnset;
			var eg1 = pokemon.eggGroups[0];
			var eg2 = pokemon.eggGroups[2];
			var sources = learnset[id];
			var template = null;
			var atLeastOne = false;
			while (true) {
				if (!template) {
					template = pokemon;
				} else {
					if (!template.prevo) break;
					template = Dex.species.get(template.prevo);
					sources = BattleLearnsets[template.id].learnset[id];
				}

				if (!sources) continue;

				if (!atLeastOne) {
					buf += '<h3>Getting it on ' + pokemon.name + '</h3><ul>';
					atLeastOne = true;
				}

				if (template.id !== pokemon.id) {
					buf += '</ul><p>From ' + template.name + ':</p><ul>';
				}

				if (!sources.length) buf += '<li>(Past gen only)</li>';

				if (typeof sources === 'string') sources = [sources];
				for (var i=0, len=sources.length; i<len; i++) {
					var source = sources[i];
					if (source.substr(0,2) === '8L') {
						buf += '<li>Level ' + parseInt(source.slice(2, 5), 10) + '</li>';
					} else if (source === '8M') {
						buf += '<li>TM/HM</li>';
					} else if (source === '8T') {
						buf += '<li>Tutor</li>';
					} else if (source === '8E') {
						buf += '<li>Egg move: breed with ';
						var hasBreeders = false;
						for (var breederid in BattleLearnsets) {
							if (!(id in BattleLearnsets[breederid].learnset)) continue;
							var breeder = BattlePokedex[breederid];
							if (breeder.isNonstandard) continue;
							if (breeder.gender && breeder.gender !== 'M') continue;
							if (breederid === 'dragonite' && template.id === 'dratini' && id === 'extremespeed') {
								buf += 'Event <a href="/pokemon/dragonite">Dragonite</a>';
								hasBreeders = true;
							}
							if (breederid === pokemon.id || breederid === template.id || breederid === pokemon.prevo) continue;
							if (eg1 === breeder.eggGroups[0] || eg1 === breeder.eggGroups[1] ||
								(eg2 && (eg2 === breeder.eggGroups[0] || eg2 === breeder.eggGroups[1]))) {
								if (hasBreeders) buf += ', ';
								buf += '<a href="/pokemon/' + breederid + '" data-target="push">' + breeder.name + '</a>';
								hasBreeders = true;
							}
						}
						if (!hasBreeders) buf += 'itself';
						buf += '</li>';
					} else if (source === '7V') {
						buf += '<li>Virtual Console transfer from Gen 1</li>';
					} else if (source === '8V') {
						buf += '<li>Pok&eacute;mon HOME transfer from Let\'s Go! Pikachu and Eevee</li>';
					} else if (source.charAt(1) === 'S') {
						buf += '<li>Event move</li>';
					}
				}
			}
			if (atLeastOne) buf += '</ul>';
		}

		// past gens
		var rrChanges = false;
		if (BattleTeambuilderTable['gen8old']) {
			var table = BattleTeambuilderTable['gen8old'];
			var changes = '';

			var rrType = move.type;
			var gen8Type = table?.overrideMoveData[id]?.type || rrType;
			if (gen8Type !== rrType) {
				changes += 'Type: ' + gen8Type + ' <i class="fa fa-long-arrow-right"></i> ' + rrType + '<br />';
			}

			var rrBP = move.basePower;
			var gen8BP = table?.overrideMoveData[id]?.basePower || rrBP;
			if (gen8BP !== rrBP) {
				changes += 'Base power: ' + gen8BP + ' <i class="fa fa-long-arrow-right"></i> ' + rrBP + '<br />';
			}

			var rrPP = move.pp;
			var gen8PP = table?.overrideMoveData[id]?.pp || rrPP;
			if (gen8PP !== rrPP) {
				changes += 'PP: ' + gen8PP + ' <i class="fa fa-long-arrow-right"></i> ' + rrPP + '<br />';
			}

			var rrAcc = move.accuracy;
			var gen8Acc = table?.overrideMoveData[id]?.accuracy || rrAcc;
			if (gen8Acc !== rrAcc) {
				var gen8AccText = (gen8Acc === true ? 'nevermiss' : gen8Acc + '%');
				var rrAccText = (rrAcc === true ? 'nevermiss' : rrAcc + '%');
				changes += 'Accuracy: ' + gen8AccText + ' <i class="fa fa-long-arrow-right"></i> ' + rrAccText + '<br />';
			}

			var rrCat = move.category;
			var gen8Cat = table?.overrideMoveData[id]?.category || rrCat;
			if (gen8Cat !== rrCat) {
				changes += gen8Cat + ' <i class="fa fa-long-arrow-right"></i> ' + rrCat + '<br />';
			}

			var rrDesc = move.shortDesc;
			var gen8Desc = table?.overrideMoveData[id]?.shortDesc || rrDesc;
			if (gen8Desc !== rrDesc) {
				changes += gen8Desc + ' <i class="fa fa-long-arrow-right"></i> ' + rrDesc + '<br />';
			}

			if (changes) {
				if (!rrChanges) buf += '<h3>Changes from Gen 8</h3><dl>';
				buf += '<dt>Gen 8 <i class="fa fa-arrow-right"></i> RR:</dt>';
				buf += '<dd>' + changes + '</dd>';
				rrChanges = true;
			}
		}
		if (rrChanges) buf += '</dl>';

		// distribution
		buf += '<ul class="utilichart metricchart nokbd">';
		buf += '</ul>';

		buf += '</div>';

		this.html(buf);

		setTimeout(this.renderDistribution.bind(this));
	},
	getDistribution: function() {
		var moveid = this.id;
		var move = BattleMovedex[moveid];
		if (this.results) return this.results;
		var results = [];
		for (var pokemonid in BattlePokedex) {
			if (
				BattlePokedex[pokemonid].isNonstandard || 
				!BattleLearnsets[pokemonid] ||
				!BattleLearnsets[pokemonid].learnset
			) {
				continue;
			}
			var sources = BattleLearnsets[pokemonid].learnset[moveid];
			if (!sources) continue;
			if (typeof sources === 'string') sources = [sources];
			var atLeastOne = false;
			for (var i=0, len=sources.length; i<len; i++) {
				var source = sources[i];
				if (source.substr(0,2) === '8L') {
					results.push('a'+sourcePad(source)+pokemonid);
					atLeastOne = true;
				} else if (source === '8M' && !move.noTM) {
					results.push('b000 '+pokemonid);
					atLeastOne = true;
				} else if (source === '8T' && !move.noTutor) {
					results.push('c000 '+pokemonid);
					atLeastOne = true;
				} else if (source === '8E') {
					results.push('d000 '+pokemonid);
					atLeastOne = true;
				} else if (source.charAt(1) === 'S' && atLeastOne !== 'S') {
					results.push('e000 '+pokemonid);
					atLeastOne = 'S';
				}
			}
			if (!atLeastOne && !move.noTM && !move.noTutor) {
				results.push('f000 '+pokemonid);
			}
		}
		results.sort();
		var last = '';
		for (var i=0; i<results.length; i++) {
			if (results[i].charAt(0) !== last) {
				results.splice(i, 0, results[i].charAt(0).toUpperCase());
				i++;
			}
			last = results[i].charAt(0);
		}
		return this.results = results;
	},
	renderDistribution: function() {
		var results = this.getDistribution();
		this.$chart = this.$('.utilichart');

		if (results.length > 1600/33) {
			this.streamLoading = true;
			this.$el.on('scroll', this.handleScroll.bind(this));

			var panelTop = this.$el.children().offset().top;
			var panelHeight = this.$el.outerHeight();
			var chartTop = this.$chart.offset().top;
			var scrollLoc = this.scrollLoc = this.$el.scrollTop();

			var start = Math.floor((scrollLoc - (chartTop-panelTop)) / 33 - 35);
			var end = Math.floor(start + 35 + panelHeight / 33 + 35);
			if (start < 0) start = 0;
			if (end > results.length-1) end = results.length-1;
			this.start = start, this.end = end;

			// distribution
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i, i < start || i > end)+'</li>';
			}
			this.$chart.html(buf);
		} else {
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i)+'</li>';
			}
			this.$chart.html(buf);
		}
	},
	renderRow: function(i, offscreen) {
		var results = this.results;
		var id = results[i].split(' ')[1];
		var template = id ? BattlePokedex[id] : undefined;
		if (!template) {
			switch (results[i].charAt(0)) {
			case 'A': // level-up move
				return '<h3>Level-up</h3>';
			case 'B': // tm/hm
				return '<h3>TM/HM</h3>';
			case 'C': // tutor
				return '<h3>Tutor</h3>';
			case 'D': // egg move
				return '<h3>Egg</h3>';
			case 'E': // event
				return '<h3>Event</h3>';
			case 'F': // past gen
				return '<h3>Past generation only</h3>';
			}
			return '<pre>error: "'+results[i]+'"</pre>';
		} else if (offscreen) {
			return ''+template.name+' '+template.abilities['0']+' '+(template.abilities['1']||'')+' '+(template.abilities['H']||'')+'';
		} else {
			var desc = '';
			switch (results[i].charAt(0)) {
			case 'a': // level-up move
				const level = Number(results[i].split(' ')[0].slice(1));
				desc = level === 0 ? 'Evo' : level === 1 ? '&ndash;' : '<small>L</small>'+(level||'?');
				break;
			case 'b': // tm/hm
				const moveType = toID(BattleMovedex[this.id].type);
				desc = '<span class="itemicon" style="margin-top:-3px;background:transparent url('+Dex.resourcePrefix+'sprites/itemicons/tm-'+moveType+'.png) no-repeat"></span>';
				break;
			case 'c': // tutor
				desc = '<img src="' + Dex.resourcePrefix + 'sprites/tutor.png" style="margin-top:-4px;opacity:.7" width="27" height="26" alt="T" />';
				break;
			case 'd': // egg move
				desc = '<span class="picon" style="margin-top:-12px;'+Dex.getPokemonIcon('egg')+'"></span>';
				break;
			case 'e': // event
				desc = '!';
				break;
			case 'f': // past generation
				desc = '...';
				break;
			}
			return BattleSearch.renderTaggedPokemonRowInner(template, desc);
		}
	},
	handleScroll: function() {
		var scrollLoc = this.$el.scrollTop();
		if (Math.abs(scrollLoc - this.scrollLoc) > 20*33) {
			this.renderUpdateDistribution();
		}
	},
	debouncedPurgeTimer: null,
	renderUpdateDistribution: function(fullUpdate) {
		if (this.debouncedPurgeTimer) {
			clearTimeout(this.debouncedPurgeTimer);
			this.debouncedPurgeTimer = null;
		}

		var panelTop = this.$el.children().offset().top;
		var panelHeight = this.$el.outerHeight();
		var chartTop = this.$chart.offset().top;
		var scrollLoc = this.scrollLoc = this.$el.scrollTop();

		var results = this.results;

		var rowFit = Math.floor(panelHeight / 33);

		var start = Math.floor((scrollLoc - (chartTop-panelTop)) / 33 - 35);
		var end = start + 35 + rowFit + 35;
		if (start < 0) start = 0;
		if (end > results.length-1) end = results.length-1;

		var $rows = this.$chart.children();

		if (fullUpdate || start < this.start - rowFit - 30 || end > this.end + rowFit + 30) {
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i, (i < start || i > end))+'</li>';
			}
			this.$chart.html(buf);
			this.start = start, this.end = end;
			return;
		}

		if (start < this.start) {
			for (var i = start; i<this.start; i++) {
				$rows[i].innerHTML = this.renderRow(i);
			}
			this.start = start;
		}

		if (end > this.end) {
			for (var i = this.end+1; i<=end; i++) {
				$rows[i].innerHTML = this.renderRow(i);
			}
			this.end = end;
		}

		if (this.end - this.start > rowFit+90) {
			var self = this;
			this.debouncedPurgeTimer = setTimeout(function() {
				self.renderUpdateDistribution(true);
			}, 1000);
		}
	}
});
