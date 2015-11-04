//=============================================================================
// AnimatedSVEnemies.js
// Version: 1.12.11 - Live and Reloaded
//=============================================================================

var Imported = Imported || {};
Imported.AnimatedSVEnemies = true;

var Rexal = Rexal || {};
Rexal.ASVE = Rexal.ASVE || {};
/*:
 * @plugindesc Version: 1.12.11 - Live and Reloaded
 * - Lets enemies be animated!
 * @author Rexal
 *

  * @param Debug
 * @desc Log to the Console(F8)?
 * @default true
 
 * @param No Movement
 * @desc Prevents enemies from moving whenever they perform an action.
 * @default false
 
 * @param Enemies Celebrate
 * @desc Enemies will celebrate over your demise.
 * @default true
 
  * @param SV Enemies Collapse
 * @desc All SV Enemies will collapse after death.
 * @default false
 
 * @param Static Enemies Breathe
 * @desc Static Enemies have a breathing effect
 * @default true
 
 * @param AGI Effects Breathing
 * @desc Static Enemies with a higher AGI stat will breathe faster.
 * @default true
 
 * @param Scale Statics by Distance
 * @desc Static Enemies will be smaller the further away they are in the background
 * @default true
 
  * @param Damage Slows Down Breathing
 * @desc Breathing slows down the more damage they take
 * @default true
 
  * @help

 --------------------------------------------------------------------------------
 Notetags
 ================================================================================
 
 
 ---------------------------[SV Battlers]---------------------------------
 
 [SV Animated]
 - Sets the enemy to use the an SV Actor sprite. These are located in the sv_actors 
 folder. Make sure that there's a sprite in that folder that matches the name
 of the enemy's image you used.

 [Collapse]
 - Lets the SV Enemy use collapse animations regardless of parameter settings.
 
 [No Collapse]
 - Prevents the SV Enemy from using collapse animations regardless of parameter settings.
 
 SV Motion: motion
 - Sets the enemy to use this motion when attacking. If you don't know what motions 
 you can use, refer to the motion list at the bottom of the help section.
 
  SV Weapon: id
 - "Equips" the enemy with this weapon.

 Ex: SV Weapon: 1
 
 
  ----------------------------[Static Battlers]---------------------------------
 
 [Breathless]
 -This enemy doesn't breathe. Useful for golems and evil walls.
 
 [Float]
 -Makes enemies have a floating effect similar to rm2k3's.
 
 Breath Control: speedScale,xScale,yScale
 -Sets the speed of the sine wave and how many times the size of the sprite it's 
  allowed to go width-wise and height-wise.
  
  You'll have to play around with the values a bit until it looks right. The 
  example below is the default settings.
 
 Ex: Breath Control: 50,5,25
 

 -----------------------------------[Both]---------------------------------------
 
 Enemy Scale: amount
 
 multiplies the size of the enemy by this amount.
 
 
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
 - Added [Float]
 
   v1.1 - Live and Reloaded
   
  -Breathing slows down the less hp an enemy has. (orignally they just breathed less) 
  - Added an option that lets enemies scale down the further into the background they are.
  - Fixed the weapons!
  - Enemies can celebrate your demise.
  - Fixed the Flash Target bug.
  - SV Enemies can collapse.
  - SV Enemies will properly appear
  - Enemies have a proper escape animation.
  - Enemies are now properly positioned.
  - You can now scale the enemies however you want.
  
   v1.101 -
   
   - Added a parameter to prevent enemies from breathing slower the more damage they take.
   
   v1.11 -
   
   - Fixed the positioning. SORRY!
   
   v1.111 -
   - No comment.
      v1.113 -
   Fixed the weapons.
   
   v1.12 -
   - Completely rewrote crucial portions of the script.
   - Note tags are no longer case-sensitive.
   - Fixed the positioning officially.
   - Fixed the floating issue.
      
	  v1.12.1 -
   - Made SV Battlers recognizable as enemies.
   - [SV] Overlays should be facing the right way now.
	  v1.12.11
	-Fixed the weapon positions. AGAIN

 
 --------------------------------------------------------------------------------
 Motion List
 ================================================================================
 walk - Ready Animation
 wait - The Idle Animation
 chant - Magic Ready animation
 guard - The Guard Animation
 damage - Damage Animation
 evade - Miss! Animation
 thrust - Stabbing Animation
 swing - Swinging Animation
 missile - Shooting Animation
 skill - Physical Skill Use Animation
 spell - Magical Skill Use Animation
 item - Item Use Animation
 escape - Escape Animation
 victory - Victory Animation
 dying - The "Danger" Animation
 abnormal - The State Affected Animation
 sleep - The Sleeping Animation
 dead - The Dead Animation
 
 
 */
 
 Rexal.ASVE.Parameters = PluginManager.parameters('animatedSVEnemies');
 Rexal.ASVE.Debug = eval(String(Rexal.ASVE.Parameters['Debug']));
 Rexal.ASVE.NoMovement = eval(String(Rexal.ASVE.Parameters['No Movement']));
  Rexal.ASVE.Breathe = eval(String(Rexal.ASVE.Parameters['Static Enemies Breathe']));
  Rexal.ASVE.AGIB = eval(String(Rexal.ASVE.Parameters['AGI Effects Breathing']));
  Rexal.ASVE.Celebration = eval(String(Rexal.ASVE.Parameters['Enemies Celebrate']));
   Rexal.ASVE.DoCollapse = eval(String(Rexal.ASVE.Parameters['SV Enemies Collapse']));
 Rexal.ASVE.DamageSlow = eval(String(Rexal.ASVE.Parameters['Damage Slows Down Breathing']));
     Rexal.ASVE.ScaleStatics = eval(String(Rexal.ASVE.Parameters['Scale Statics by Distance']));  
  //-----------------------------------------------------------------------------
// BattleManager
//=============================================================================
  
  if(Rexal.ASVE.Celebration)
  {  

  BattleManager.processDefeat = function() {
    if(Rexal.ASVE.Celebration)$gameTroop.performVictory();
	this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};
  }
  
  //-----------------------------------------------------------------------------
// Game_Enemy
//=============================================================================

	Game_Enemy.prototype.performAttack = function() {
		
		
			if(this._weaponId == 0){this.requestMotion(this._motion);
			return;
			}
		
     var weapon = $dataWeapons[this._weaponId];
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
		
		if(this._motion != 'thrust')this.requestMotion(this._motion);
		
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

	
Game_Enemy.prototype.attackAnimationId = function() {

  if(this._weaponId!=0)  return $dataWeapons[this._weaponId].animationId;
  else
	  return 1;
};

  //-----------------------------------------------------------------------------
// Game_Troop
//=============================================================================
Game_Troop.prototype.performVictory = function() {
    this.members().forEach(function(enemy) {
        enemy.performVictory();
    });
};
  //-----------------------------------------------------------------------------
// Sprite_Enemy
//=============================================================================

Sprite_Enemy.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX(), battler.screenY());
    this._stateIconSprite.setup(battler);
};
	
Sprite_Enemy.prototype.updateBitmap = function() {

	


	if(!this._enemy._breathless && Rexal.ASVE.Breathe){

		var a = 1;
		if(Rexal.ASVE.AGIB) a = this._enemy.agi/100+1;
	var breathS = this._enemy._breath[0]/1000;
	if(Rexal.ASVE.DamageSlow) breathS *= (this._enemy.hp/this._enemy.mhp)+.1;
	var breathY = Math.cos(Graphics.frameCount*breathS*a)*(this._enemy._breath[2]/1000);
	var breathX = Math.cos(Graphics.frameCount*breathS)*(this._enemy._breath[1]/1000);
	
	if(Rexal.ASVE.DamageSlow)breathY *= (this._enemy.hp/this._enemy.mhp);
	var ss = Graphics.boxHeight/624+.1;
	if(Rexal.ASVE.ScaleStatics)var s = ss*(this._homeY/Graphics.boxHeight)*this._enemy._scale;
	else var s = this._enemy._scale;
	
	
	this.scale.y = s+breathY;
	this.scale.x = s+breathX;
	
	}
	
	if(this._enemy._floating && !this.isBusy)
	{
		var f = Math.cos(Graphics.frameCount/50)*20;
		this.setHome(this._enemy.screenX(),this._enemy.screenY()+f);
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


Sprite_Enemy.prototype.stepForward = function() {
   if(!Rexal.ASVE.NoMovement) this.startMove(48, 0, 12);
};


	
		Sprite_Enemy.prototype.setHome = function(x,y) {
			
			var dX = Graphics.boxWidth/816;
			var dY = Graphics.boxHeight/624;
			
			y*= dY;
			x*= dX;
			
			this._homeX = x;
			this._homeY = y + (Graphics.boxHeight - 624)/3;
			this.updatePosition();
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
	
    this._weaponSprite = new Sprite_Weapon();

    this.addChild(this._weaponSprite);
};

 
 Sprite_Actor.prototype.createStateSprite = function() {
    this._stateSprite = new Sprite_StateOverlay();
	this._stateSprite.scale.x  = -1;
    this.addChild(this._stateSprite);
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


Sprite_EnemyRex.prototype.updateBitmap = function() {
	this.updateEffect();
    Sprite_Battler.prototype.updateBitmap.call(this);
	var hue = this._actor.battlerHue();
    var name = this._actor.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name;
        this._mainSprite.bitmap = ImageManager.loadSvActor(name,hue);
		this._mainSprite.scale.x = -this._actor._scale;
		this._mainSprite.scale.y = this._actor._scale;
    }
};

Sprite_EnemyRex.prototype.setupWeaponAnimation = function() {
    if (this._actor.isWeaponAnimationRequested()) {
        this._weaponSprite.setup(this._actor.weaponImageId() );
		this._weaponSprite.scale.x = -this._actor._scale;
		this._weaponSprite.scale.y = this._actor._scale;
		this._weaponSprite.x = -this._weaponSprite.x;
        this._actor.clearWeaponAnimation();
    }

};

Sprite_EnemyRex.prototype.setActorHome = function(battler) {
			
			var dX = Graphics.boxWidth/816;
			var dY = Graphics.boxHeight/624;
	
			var x = battler.screenX()*dX; 
			var y = battler.screenY()*dY;
			
			this._homeX = x;
			this._homeY = y + (Graphics.boxHeight - 624)/3;
			this.updatePosition();
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
    this.startMove(300, 0, 30);
};

Sprite_EnemyRex.prototype.initVisibility = function() {
    this._appeared = this._actor.isAlive();
    if (!this._appeared) {
        this.opacity = 0;
    }
};

Sprite_EnemyRex.prototype.setupEffect = function() {
		

    if (this._appeared && this._actor.isEffectRequested()) {
        this.startEffect(this._actor.effectType());
        this._actor.clearEffect();
    }
    if (!this._appeared && this._actor.isAlive()) {
        this.startEffect('appear');
    } else if (this._appeared && this._actor.isHidden()) {
        this.startEffect('disappear');
    }
};

Sprite_EnemyRex.prototype.startEffect = function(effectType) {
	
    this._effectType = effectType;
    switch (this._effectType) {
    case 'appear':
        this.startAppear();
        break;
    case 'disappear':
        this.startDisappear();
        break;
    case 'whiten':
        this.startWhiten();
        break;
    case 'blink':
        this.startBlink();
        break;
    case 'collapse':
     if(this._actor._collapse)   this.startCollapse();
        break;
    case 'bossCollapse':
        this.startBossCollapse();
        break;
    case 'instantCollapse':
        this.startInstantCollapse();
        break;
    }
    this.revertToNormal();
};

Sprite_EnemyRex.prototype.startAppear = function() {
    this._effectDuration = 16;
    this._appeared = true;
};

Sprite_EnemyRex.prototype.startDisappear = function() {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_EnemyRex.prototype.startWhiten = function() {
    this._effectDuration = 16;
};

Sprite_EnemyRex.prototype.startBlink = function() {
    this._effectDuration = 20;
};

Sprite_EnemyRex.prototype.startCollapse = function() {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_EnemyRex.prototype.startBossCollapse = function() {
    this._effectDuration = this._mainSprite.height;
    this._appeared = false;
};

Sprite_EnemyRex.prototype.startInstantCollapse = function() {
    this._effectDuration = 16;
    this._appeared = false;
};

Sprite_EnemyRex.prototype.updateEffect = function() {

	
    this.setupEffect();
    if (this._effectDuration > 0) {
        this._effectDuration--;
        switch (this._effectType) {
        case 'whiten':
            this.updateWhiten();
            break;
        case 'blink':
            this.updateBlink();
            break;
        case 'appear':
            this.updateAppear();
            break;
        case 'disappear':
            this.updateDisappear();
            break;
        case 'collapse':
       if(this._actor._collapse)     this.updateCollapse();
            break;
        case 'bossCollapse':
       if(this._actor._collapse)     this.updateBossCollapse();
            break;
        case 'instantCollapse':
      if(this._actor._collapse)      this.updateInstantCollapse();
            break;
        }
        if (this._effectDuration === 0) {
            this._effectType = null;
        }
    }
};


	
Sprite_EnemyRex.prototype.isEffecting = function() {
   if(this._actor._collapse) return this._effectType !== null;
};



Sprite_EnemyRex.prototype.revertToNormal = function() {
    this._shake = 0;
    this.blendMode = 0;
    this.opacity = 255;
    this.setBlendColor([0, 0, 0, 0]);
};

Sprite_EnemyRex.prototype.updateWhiten = function() {
    var alpha = 128 - (16 - this._effectDuration) * 10;
    this.setBlendColor([255, 255, 255, alpha]);
};

Sprite_EnemyRex.prototype.updateBlink = function() {
    this.opacity = (this._effectDuration % 10 < 5) ? 255 : 0;
};

Sprite_EnemyRex.prototype.updateAppear = function() {
	    this.setHome(this._homeX,this._homeY);
		    this.opacity = (16 - this._effectDuration) * 16;
};

Sprite_EnemyRex.prototype.updateDisappear = function() {
	    this.setHome(this._homeX-10,this._homeY);
    this.opacity = 256 - (32 - this._effectDuration) * 10;
};

Sprite_Enemy.prototype.updateAppear = function() {
	    this.setHome(this._homeX,this._homeY);
				    this.opacity = (16 - this._effectDuration) * 16;
};

Sprite_Enemy.prototype.updateDisappear = function() {
	    this.setHome(this._homeX-10,this._homeY);
    this.opacity = 256 - (32 - this._effectDuration) * 10;
};

Sprite_EnemyRex.prototype.updateCollapse = function() {
    this.blendMode = Graphics.BLEND_ADD;
    this.setBlendColor([255, 128, 128, 128]);
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
};

Sprite_EnemyRex.prototype.updateBossCollapse = function() {
    this._shake = this._effectDuration % 2 * 4 - 2;
    this.blendMode = Graphics.BLEND_ADD;
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
    this.setBlendColor([255, 255, 255, 255 - this.opacity]);
    if (this._effectDuration % 20 === 19) {
        SoundManager.playBossCollapse2();
    }
};

Sprite_EnemyRex.prototype.updateInstantCollapse = function() {
    this.opacity = 0;
};

Sprite_EnemyRex.prototype.damageOffsetX = function() {
    return 0;
};

Sprite_EnemyRex.prototype.damageOffsetY = function() {
    return -8;
};

  //-----------------------------------------------------------------------------
// Spriteset_Battle
//=============================================================================

Spriteset_Battle.prototype.createEnemies = function() {
    var enemies = $gameTroop.members();
    var sprites = [];
    for (var i = 0; i < enemies.length; i++) {
	var enemy = enemies[i];
	var baseEnemy = $dataEnemies[enemies[i].enemyId()];
	
	Rexal.ASVE.processEnemyNoteTag(baseEnemy);
	Rexal.ASVE.processEnemyData(enemy,baseEnemy);
	
    if(enemy._animated)  
	{
		sprites[i] = new Sprite_EnemyRex(enemies[i]);
		sprites[i]._enemy = sprites[i]._actor;
		sprites[i].opacity = 0;
	}
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

Object.defineProperties(Game_Enemy.prototype, {
  animated: { get: function() { return this._animated; }, configurable: true },
  motion: { get: function() { return this._motion; }, configurable: true },
  weaponid: { get: function() { return this._weaponId; }, configurable: true },
  breathless: { get: function() { return this._breathless; }, configurable: true },
  floating: { get: function() { return this._float; }, configurable: true },
  scale: { get: function() { return this._scale; }, configurable: true },
  collapse: { get: function() { return this._collapse; }, configurable: true },
  breath: { get: function() { return this._breath; }, configurable: true }
});

Rexal.log = function(message,type){
if(!Rexal.ASVE.Debug) return;
if(!type) type = 'log';

switch (type) {
	

	case 'log' :
	console.log(message);
	break;
	
	case 'info' :
	console.debug(message);
	break;
	
	case 'warn' :
	console.warn(message);
	break;
	
	case 'error' :
	console.error(message);
	break;
}

}

Rexal.ASVE.processEnemyData = function(obj,obj2) {
obj._breath = [];
obj._animated = obj2.animated;
obj._motion = obj2.motion;
obj._weaponId = obj2.weaponid;
obj._breathless = obj2.breathless;
obj._floating = obj2.floating;
obj._scale = obj2.scale;
obj._breath[0] = obj2.breath[0];
obj._breath[1] = obj2.breath[1];
obj._breath[2] = obj2.breath[2];
obj._collapse = obj2.collapse;
}

Rexal.ASVE.processEnemyNoteTag = function(obj) {

Rexal.log('reading ' + obj.name + '...');

obj.motion = 'thrust';
obj.weaponid = 0;
obj.collapse = Rexal.ASVE.DoCollapse;
obj.breath = [50,5,25];
obj.scale = 1.0;

if(obj == null)return;

		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		var lines = line.split(': ');
		
		switch (lines[0].toLowerCase()) {
		
		case '[sv animated]' :
        obj.animated = true;
		Rexal.log(obj.name + ' is using SV Battler sprites','info');
		break;
		
		case 'sv motion' :
        obj.motion = lines[1].toLowerCase();
		Rexal.log(obj.name + "'s attack motion is:" + obj.motion,'info');
		break;
		
		case 'sv weapon' :
        obj.weaponid = parseInt(lines[1]);
		Rexal.log(obj.name + " has weapon " + $dataWeapons[obj.weaponid].name,'info');
		break;
		
		case '[breathless]' :
        obj.breathless = true;
		Rexal.log(obj.name + " is breathless.",'info');
		break;	
		
		case '[float]' :
		obj.floating = true;
		Rexal.log(obj.name + " floats.",'info');
		break;	
		
		case '[collapse]' :
		obj.collapse = true;
		Rexal.log(obj.name + " can collapse.",'info');		
		break;	
		
		case '[no collapse]' :
		obj.collapse = false;
		Rexal.log(obj.name + " cannot collapse.",'info');	
		break;
		
		case 'breath control' :
		
		var lines2 = lines[1].split(',');
		obj.breath[0] = parseInt(lines2[0]);
		obj.breath[1] = parseInt(lines2[1]);
		obj.breath[2] = parseInt(lines2[2]);
		Rexal.log(obj.name + "'s breath control: " + obj.breath,'info');
		break;
		
		case 'enemy scale' :
		obj.scale = parseFloat(lines[1]);
		Rexal.log(obj.name + " is " + obj.scale +"x bigger than normal.",'info');
		}
		
			
		}
		return obj;
};