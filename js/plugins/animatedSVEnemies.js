//=============================================================================
// AnimatedSVEnemies.js
// Version: 1.15.5.1 - The Re-Remake
//=============================================================================

var Imported = Imported || {};
Imported.AnimatedSVEnemies = true;

var Rexal = Rexal || {};
Rexal.ASVE = Rexal.ASVE || {};
/*:
 * @plugindesc Version: 1.15.5.1 - The Re-Remake
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
 
	SV Weapon Scale: amount
	 multiplies the size of the weapon by this amount.
	 
	 SV Weapon Anchor: x,y
	 sets the weapon's anchor point to this.
	 
Ex. SV Weapon Anchor: .5,1

 	 SV Anchor: x,y
	 sets the battler's anchor point to this.
	 
Ex. SV Anchor: .5,1
 
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
   
   v1.15 - The Re-Remake
   - Massive cleanup that should make it much more compatible.
  
	v1.15.1 -
	-Solved the issue with damage numbers not popping up.
	v1.15.3
	-Fixed Some stuff.
	v1.15.5
	-Added some stuff. =m=
	
	v1.15.5.1
	-Should be more compatible with stuff
 
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
 //Original Functions Storage
//=============================================================================
Rexal.ASVE.Game_Enemy_makeActions = Game_Enemy.prototype.makeActions;
Rexal.ASVE.Game_Enemy_performDamage = Game_Enemy.prototype.performDamage;
Rexal.ASVE.Sprite_Enemy_updateBitmap =   Sprite_Enemy.prototype.updateBitmap;
Rexal.ASVE.seupdateappear = Sprite_Enemy.prototype.updateAppear;
Rexal.ASVE.processDefeat = BattleManager.processDefeat;
Rexal.ASVE.spriteactorupdatebitmap = Sprite_Actor.prototype.updateBitmap;
Rexal.ASVE.setupweaponanimation = Sprite_Actor.prototype.setupWeaponAnimation;
Rexal.ASVE.setactorhome = Sprite_Actor.prototype.setActorHome;
  //-----------------------------------------------------------------------------
// BattleManager
//=============================================================================
  
  if(Rexal.ASVE.Celebration)
  {  

  BattleManager.processDefeat = function() {
	  Rexal.ASVE.processDefeat.call(this);
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

Game_Enemy.prototype.weapons = function() {
	
 if(this._animated) return [$dataWeapons[this._weaponId]];
 else return [1];
};


Game_Enemy.prototype.performAttack = function() {
	Game_Actor.prototype.performAttack.call(this);
};

Game_Enemy.prototype.attackAnimationId1 = function() {
Game_Actor.prototype.attackAnimationId1.call(this);
};

Game_Enemy.prototype.attackAnimationId2 = function() {
Game_Actor.prototype.attackAnimationId2.call(this);
};

Game_Enemy.prototype.bareHandsAnimationId = function() {
Game_Actor.prototype.bareHandsAnimationId.call(this);
};

Game_Enemy.prototype.hasNoWeapons = function() {
 if(this._animated && this._weaponId!=0)
	 return false;
	 else return true;
}


Game_Enemy.prototype.performAction = function(action) {
Game_Actor.prototype.performAction.call(this,action);
};

Game_Enemy.prototype.performDamage = function() {
    Rexal.ASVE.Game_Enemy_performDamage.call(this);
    this.requestMotion('damage');
};

Game_Enemy.prototype.actor = function() {
    return $dataEnemies[this._enemyId];
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
Rexal.ASVE.Game_Enemy_makeActions.call(this);
 this.setActionState('undecided');
};


Game_Enemy.prototype.performEscape = function() {
    if (this.canMove()) {
        this.requestMotion('escape');
    }
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
	
 Rexal.ASVE.Sprite_Enemy_updateBitmap.call(this);

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
	
	this.smooth = true;
	
	this.scale.y = s+breathY;
	this.scale.x = s+breathX;
	
	}
	
	if(this._enemy._floating && !this.isBusy)
	{
		var f = Math.cos(Graphics.frameCount/50)*20;
		this.setHome(this._enemy.screenX(),this._enemy.screenY()+f);
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

 Sprite_EnemyRex.prototype.loadBitmap = function(name, hue) {

        this.bitmap = ImageManager.loadSvActor(name,hue);
};

Sprite_EnemyRex.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    var changed = (battler !== this._actor);
    if (changed) {
        this._actor = battler;
		this._enemy = battler;
        if (battler) {
            this.setActorHome(battler);
        }
        this.startEntryMotion();
        this._stateSprite.setup(battler);
    }
};


Sprite_EnemyRex.prototype.updateBitmap = function() {
	Rexal.ASVE.spriteactorupdatebitmap.call(this);
	this.updateEffect();
	var hue = this._actor.battlerHue();
    var name = this._actor.battlerName();
        this._mainSprite.bitmap = ImageManager.loadSvActor(name,hue);
		this._mainSprite.scale.x = -this._actor._scale;
		this._mainSprite.scale.y = this._actor._scale;
		this._mainSprite.anchor.x = this._actor._anchor[0];
		this._mainSprite.anchor.y = this._actor._anchor[1];

};

Sprite_EnemyRex.prototype.setupWeaponAnimation = function() {
	
	Rexal.ASVE.setupweaponanimation.call(this);
		if(!this._weaponSprite._positioned)
		{
			
		var scale = this._actor._scale+this._actor._weaponScale;
		
		this._weaponSprite.scale.x = -scale;
		this._weaponSprite.scale.y = scale;
		this._weaponSprite.x = -this._weaponSprite.x*scale;
        
		this._weaponSprite.anchor.x = this._actor._weaponAnchor[0];
		this._weaponSprite.anchor.y = this._actor._weaponAnchor[1];
		
		this._weaponSprite._positioned = true;
		}
		

};

Sprite_EnemyRex.prototype.setActorHome = function(battler) {
			Rexal.ASVE.setactorhome.call(this);
			var dX = Graphics.boxWidth/816;
			var dY = Graphics.boxHeight/624;
	
			var x = battler.screenX()*dX; 
			var y = battler.screenY()*dY;
			
			this._homeX = x;
			this._homeY = y + (Graphics.boxHeight - 624)/3;
			this.updatePosition();
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
	 this._enemy = this._actor;
Sprite_Enemy.prototype.setupEffect.call(this);
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
Sprite_Enemy.prototype.startAppear.call(this);
};

Sprite_EnemyRex.prototype.startDisappear = function() {
Sprite_Enemy.prototype.startDisappear.call(this);
};

Sprite_EnemyRex.prototype.startWhiten = function() {
Sprite_Enemy.prototype.startWhiten.call(this);
};

Sprite_EnemyRex.prototype.startBlink = function() {
Sprite_Enemy.prototype.startBlink.call(this);
};

Sprite_EnemyRex.prototype.startCollapse = function() {
Sprite_Enemy.prototype.startCollapse.call(this);
};

Sprite_EnemyRex.prototype.startBossCollapse = function() {
Sprite_Enemy.prototype.startBossCollapse.call(this);
};

Sprite_EnemyRex.prototype.startInstantCollapse = function() {
Sprite_Enemy.prototype.startInstantCollapse.call(this);
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
Sprite_Enemy.prototype.isEffecting.call(this);
};



Sprite_EnemyRex.prototype.revertToNormal = function() {
Sprite_Enemy.prototype.revertToNormal.call(this);
};

Sprite_EnemyRex.prototype.updateWhiten = function() {
Sprite_Enemy.prototype.updateWhiten.call(this);
};

Sprite_EnemyRex.prototype.updateBlink = function() {
Sprite_Enemy.prototype.updateBlink.call(this);
};

Rexal.ASVE.seupdateappear = Sprite_Enemy.prototype.updateAppear;
Sprite_Enemy.prototype.updateAppear = function() {
	Rexal.ASVE.seupdateappear.call(this);
	    this.setHome(this._homeX,this._homeY);
};


Rexal.ASVE.seupdatedisappear = Sprite_Enemy.prototype.updateDisappear;

Sprite_Enemy.prototype.updateDisappear = function() {
		Rexal.ASVE.seupdatedisappear.call(this);
	    this.setHome(this._homeX-10,this._homeY);
};


Sprite_EnemyRex.prototype.updateAppear = function() {
	Sprite_Enemy.prototype.updateAppear.call(this);
};

Sprite_EnemyRex.prototype.updateDisappear = function() {
	Sprite_Enemy.prototype.updateDisappear.call(this);
};



Sprite_EnemyRex.prototype.updateCollapse = function() {
Sprite_Enemy.prototype.updateCollapse.call(this);
};

Sprite_EnemyRex.prototype.updateBossCollapse = function() {
Sprite_Enemy.prototype.updateBossCollapse.call(this);
};

Sprite_EnemyRex.prototype.updateInstantCollapse = function() {
Sprite_Enemy.prototype.updateInstantCollapse.call(this);
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
  weaponscale: { get: function() { return this._weaponscale; }, configurable: true },
  weaponanchor: { get: function() { return this._weaponanchor; }, configurable: true },
  anchor: { get: function() { return this._anchor; }, configurable: true },
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
obj._weaponAnchor = [];
obj._anchor = [];
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
obj._weaponScale = obj2.weaponscale;
obj._weaponAnchor = obj2.weaponanchor;
obj._anchor = obj2.anchor;
}

Rexal.ASVE.processEnemyNoteTag = function(obj) {

Rexal.log('reading ' + obj.name + '...');

obj.motion = 'thrust';
obj.weaponid = 0;
obj.collapse = Rexal.ASVE.DoCollapse;
obj.breath = [50,5,25];
obj.scale = 1.0;
obj.weaponscale = 0.0;
obj.weaponanchor = [.5,1];
obj.anchor = [.5,1];

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
		break;
		
		case 'sv weapon scale' :
		obj.weaponscale = parseFloat(lines[1])-1;
		Rexal.log(obj.name + "'s weapon is " + obj.scale +"x bigger than normal.",'info');
		break;		
		
		case 'sv weapon anchor' :
		
		var lines2 = lines[1].split(',');
		obj.weaponanchor[0] = parseFloat(lines2[0]);
		obj.weaponanchor[1] = parseFloat(lines2[1]);
		Rexal.log(obj.name + "'s weapon is anchored to " + obj.weaponanchor[0] +" and " + obj.weaponanchor[1],'info');
		break;		
		
		case 'sv anchor' : //WIP
		
		var lines2 = lines[1].split(',');
		obj.anchor[0] = parseFloat(lines2[0]);
		obj.anchor[1] = parseFloat(lines2[1]);
		Rexal.log(obj.name + " is anchored to " + obj.anchor[0] +" and " + obj.anchor[1],'info');
		break;		
		
		}
		
			
		}
		return obj;
};