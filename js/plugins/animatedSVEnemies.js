//=============================================================================
// AnimatedEnemies.js
// Version: 1.08 - Deep Breaths
//=============================================================================

var Imported = Imported || {};
Imported.AnimatedSVEnemies = true;

var Rexal = Rexal || {};
Rexal.ASVE = Rexal.ASVE || {};
/*:
 * @plugindesc Version: 1.08 - Deep Breaths
 * - Lets enemies be animated!
 * @author Rexal
 *

 
 * @param No Movement
 * @desc Prevents enemies from moving whenever they perform an action.
 * @default false
 
 * @param Static Enemies Breathe
 * @desc Static Enemies have a breathing effect
 * @default true
 
 * @param AGI Effects Breathing
 * @desc Enemies with a higher AGI stat will breathe faster.
 * @default true
  * @help
 
 --------------------------------------------------------------------------------
 Important!
 ================================================================================
 
 IF USING YANFLY CORE ENGINE SET ITS PARAMETER "FLASH TARGET" TO TRUE OTHERWISE 
 IT WILL CAUSE AN ERROR.
 
 --------------------------------------------------------------------------------
 Notetags
 ================================================================================
 
 
 ---------------------------[Side View Battlers]---------------------------------
 
 [SV Animated]
 - Sets the enemy to use the an SV battler. 

 SV Motion: motion
 - Sets the enemy to use this motion when attacking.
 
  SV Weapon: id
 - "Equips" the enemy with this weapon.

 Ex: SV Weapon: 1
 
  ----------------------------[Static Battlers]---------------------------------
 
 [No Breath]
 -This enemy doesn't breathe. Useful for golems and evil walls.
 
 Breath Control: speedScale,xScale,yScale
 -Sets the speed of the sine wave and how many times the size of the sprite it's 
  allowed to go width-wise and height-wise.
  
  You'll have to play around with the values a bit until it looks right. The 
  example below is the default settings.
 
 Ex: Breath Control: 50,5,25
 
 [Float]
 - Makes enemies have a floating effect similar to rm2k3's.
 
 
 
 --------------------------------------------------------------------------------
 Version Log
 ================================================================================
  
 v1 - Initial Version
 
 v1.05 - Many fixes
 - Fixed issue with enemies not playing the right animations when more than one 
 enemy is on the screen.
 - Misc. Fixes that I've forgotten about.
 - Added SV Weapon, which lets you play a weapon animation(currently backwards). 
 This is not yet compatible with my other script: Sprite Weapons Enhanced.
 - Added a param that stops enemies from moving.
 
  v1.075 - Deep breaths
 - Static enemies breathe now!
 - Added a bunch of stuff to control the breathing. (notetags do not work!) 
 
   v1.08 - Fixed Breathing
 - The breathing notetags work now! Yay! 
 - Added []
 
 */
 
 Rexal.ASVE.Parameters = PluginManager.parameters('animatedSVEnemies');
 Rexal.ASVE.NoMovement = eval(String(Rexal.ASVE.Parameters['No Movement']));
  Rexal.ASVE.Breathe = eval(String(Rexal.ASVE.Parameters['Static Enemies Breathe']));
  Rexal.ASVE.AGIB = eval(String(Rexal.ASVE.Parameters['AGI Effects Breathing']));
  //-----------------------------------------------------------------------------
// Game_Enemy
//=============================================================================

	Game_Enemy.prototype.performAttack = function() {
		
		Rexal.ASVE.processEnemyNoteTag( $dataEnemies[this._enemyId] );
		
			if(Rexal.ASVE._weaponID == 0){this.requestMotion(Rexal.ASVE._motion);
			return;
			}
		
     var weapon = $dataWeapons[Rexal.ASVE._weaponID];
    var wtypeId = weapon.wtypeId;
    var attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        if (attackMotion.type === 0) {
            this.requestMotion('thrust');
        } else if (attackMotion.type === 1) {
            this.requestMotion('swing');
        } else if (attackMotion.type === 2) {
            this.requestMotion('missile');
        }
		this.startWeaponAnimation(attackMotion.weaponImageId);
    }
};


Game_Enemy.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
    if (action.isAttack()) {
        this.performAttack();
    } else if (action.isGuard()) {
        this.requestMotion('guard');
    } else if (action.isMagicSkill()) {
        this.requestMotion('spell');
    } else if (action.isSkill()) {
        this.requestMotion('skill');
    } else if (action.isItem()) {
        this.requestMotion('item');
    }
};

Game_Enemy.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion('damage');
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};

Game_Enemy.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
    this.requestMotion('evade');
};

Game_Enemy.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
    this.requestMotion('evade');
};

Game_Enemy.prototype.performCounter = function() {
    Game_Battler.prototype.performCounter.call(this);
    this.performAttack();
};

Game_Enemy.prototype.performVictory = function() {
    if (this.canMove()) {
        this.requestMotion('victory');
    }
};


Game_Enemy.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        var actionList = this.enemy().actions.filter(function(a) {
            return this.isActionValid(a);
        }, this);
        if (actionList.length > 0) {
            this.selectAllActions(actionList);
        }
    }
 this.setActionState('undecided');
};


Game_Enemy.prototype.performEscape = function() {
    if (this.canMove()) {
        this.requestMotion('escape');
    }
};

  //-----------------------------------------------------------------------------
// Sprite_Enemy
//=============================================================================
if(Rexal.ASVE.Breathe)
{

	
Sprite_Enemy.prototype.updateBitmap = function() {

	
	Rexal.ASVE.processEnemyNoteTag(this._enemy.enemy());

	if(!Rexal.ASVE._noBreath){
		var a = 1;
		if(Rexal.ASVE.AGIB) a = this._enemy.agi/100+1;
	var breathS = Rexal.ASVE._breathScale/1000;
	var breathY = Math.cos(Graphics.frameCount*breathS*a)*(Rexal.ASVE._breathY/1000);
	var breathX = Math.cos(Graphics.frameCount*breathS)*(Rexal.ASVE._breathX/1000);
	
	breathY *= (this._enemy.hp/this._enemy.mhp);
	
	this.scale.y = 1+breathY;
	this.scale.x = 1+breathX;
	
	}
	
	if(Rexal.ASVE._float)
	{
		this.setHome(this.x,this.y-Math.sin(Graphics.frameCount/50)/4);
	}
	
	    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._enemy.battlerName();
    var hue = this._enemy.battlerHue();
    if (this._battlerName !== name || this._battlerHue !== hue) {
        this._battlerName = name;
        this._battlerHue = hue;
        this.loadBitmap(name, hue);
        this.initVisibility();
    }
};


}
  //-----------------------------------------------------------------------------
// Sprite_WeaponRex
//=============================================================================

function Sprite_WeaponRex() {
    this.initialize.apply(this, arguments);
}

Sprite_WeaponRex.prototype = Object.create(Sprite_Weapon.prototype);
Sprite_WeaponRex.prototype.constructor = Sprite_WeaponRex;

Sprite_WeaponRex.prototype.loadBitmap = function() {
	
	this.scale.x = -1;
    var pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
    if (pageId >= 1) {
        this.bitmap = ImageManager.loadSystem('Weapons' + pageId);
    } else {
        this.bitmap = ImageManager.loadSystem('');
    }

};


Sprite_WeaponRex.prototype.updateFrame = function() { 	
    if (this._weaponImageId > 0) {
        var index = (this._weaponImageId - 1) % 12;
        var w = 96;
        var h = 64;
        var sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        var sy = Math.floor(index % 6) * h;
        this.setFrame(-sx, sy, -w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};


  //-----------------------------------------------------------------------------
// Sprite_EnemyRex
//=============================================================================

function Sprite_EnemyRex() {
    this.initialize.apply(this, arguments);
}


 Sprite_EnemyRex.prototype = Object.create(Sprite_Actor.prototype);
Sprite_EnemyRex.prototype.constructor = Sprite_EnemyRex;

Sprite_EnemyRex.prototype.createWeaponSprite = function() {
	
    this._weaponSprite = new Sprite_WeaponRex();
    this.addChild(this._weaponSprite);
};


Sprite_EnemyRex.prototype.updateSelectionEffect = function() {
	
	    var target = this._effectTarget;
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
	
}

 Sprite_EnemyRex.prototype = Object.create(Sprite_Actor.prototype);
Sprite_EnemyRex.prototype.constructor = Sprite_EnemyRex;

 Sprite_EnemyRex.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);

};
 
 Sprite_EnemyRex.prototype.loadBitmap = function(name, hue) {
    if ($gameSystem.isSideView()) {
        this.bitmap = ImageManager.loadSvActor(name,hue);
    } else {
        this.bitmap = ImageManager.loadEnemy(name, hue);
    }
};

Sprite_EnemyRex.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    var changed = (battler !== this._actor);
    if (changed) {
        this._actor = battler;
        if (battler) {
            this.setActorHome(battler);
        }
        this.startEntryMotion();
        this._stateSprite.setup(battler);
    }
};



Sprite_EnemyRex.prototype.setActorHome = function(battler) {
    this.setHome(battler.screenX(), battler.screenY());
};


Sprite_EnemyRex.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
	var hue = this._actor.battlerHue();
    var name = this._actor.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name;
        this._mainSprite.bitmap = ImageManager.loadSvActor(name,hue);
		this._mainSprite.scale.x = -1;
    }
};

Sprite_EnemyRex.prototype.setupWeaponAnimation = function() {
	Rexal.ASVE.processEnemyNoteTag($dataEnemies[this._actor._enemyId]);
    if (this._actor.isWeaponAnimationRequested()) {
        this._weaponSprite.setup($dataWeapons[Rexal.ASVE._weaponID].wtypeId);
        this._actor.clearWeaponAnimation();
    }

};


Sprite_EnemyRex.prototype.damageOffsetX = function() {
    return 32;
};

Sprite_EnemyRex.prototype.stepForward = function() {
   if(!Rexal.ASVE.NoMovement) this.startMove(48, 0, 12);
};

Sprite_EnemyRex.prototype.stepBack = function() {
   if(!Rexal.ASVE.NoMovement) this.startMove(0, 0, 12);
};

Sprite_EnemyRex.prototype.retreat = function() {
    this.startMove(-300, 0, 30);
};



  //-----------------------------------------------------------------------------
// Spriteset_Battle
//=============================================================================

Spriteset_Battle.prototype.createEnemies = function() {
    var enemies = $gameTroop.members();
    var sprites = [];
    for (var i = 0; i < enemies.length; i++) {
		
	Rexal.ASVE.processEnemyNoteTag($dataEnemies[enemies[i]._enemyId]);
	
    if(Rexal.ASVE._animated)  
		
		sprites[i] = new Sprite_EnemyRex(enemies[i]);
	else 
		sprites[i] = new Sprite_Enemy(enemies[i]);
	
    }
	
    sprites.sort(this.compareEnemySprite.bind(this));
    for (var j = 0; j < sprites.length; j++) {
        this._battleField.addChild(sprites[j]);
    }
    this._enemySprites = sprites;
};


// Spriteset_Battle.prototype.updateActors = function() {
    // var members = $gameParty.battleMembers();
	    // var enemies = $gameTroop.members();
		
		    // for (var i = 0; i < this._enemySprites.length; i++) {
        // this._enemySprites[i].setBattler(enemies[i]);
    // }
		
    // for (var i = 0; i < this._actorSprites.length; i++) {
        // this._actorSprites[i].setBattler(members[i]);
    // }
// };


  //-----------------------------------------------------------------------------
// Rex Functions
//=============================================================================


Rexal.ASVE.processEnemyNoteTag = function(obj) {

Rexal.ASVE._animated = false;
Rexal.ASVE._motion = 'thrust';
Rexal.ASVE._weaponID = 0;
Rexal.ASVE._noBreath = false;
Rexal.ASVE._float = false;
Rexal.ASVE._breathX = 5;
Rexal.ASVE._breathY = 25;
Rexal.ASVE._breathScale = 50;

if(obj == null)return;

		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		var lines = line.split(': ');
		
		switch (lines[0]) {
		
		case '[SV Animated]' :
        Rexal.ASVE._animated = true;
		break;
		
		case 'SV Motion' :
        Rexal.ASVE._motion = lines[1].toLowerCase();
		break;
		
		case 'SV Weapon' :
        Rexal.ASVE._weaponID = parseInt(lines[1]);
		break;
		
		case '[Breathless]' :
		Rexal.ASVE._noBreath = true;
		break;	
		
		case '[Float]' :
		Rexal.ASVE._float = true;
		break;	
		
		case 'Breath Control' :
		
		var lines2 = lines[1].split(',');


		
		Rexal.ASVE._breathScale = parseInt(lines2[0]);
		Rexal.ASVE._breathX = parseInt(lines2[1]);
		Rexal.ASVE._breathY = parseInt(lines2[2]);
		break;
		}
		
			
		}
};