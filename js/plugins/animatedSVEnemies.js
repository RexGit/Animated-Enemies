//=============================================================================
// AnimatedSVEnemies.js
// Version: 1.0
//=============================================================================

var Imported = Imported || {};
Imported.AnimatedSVEnemies = true;

var Rexal = Rexal || {};
Rexal.ASVE = Rexal.ASVE || {};
/*:
 * @plugindesc Lets enemies use animated SV battlers
 * @author Rexal
 *
 * @help
 
 Notetags:
 
 
 [SV Animated]
 Sets the enemy to use the an SV battler. 

 SV Motion: motion
 
 Sets the enemy to use this motion when attacking.
 
 Version Log:
 
 v1 - Initial Version
 
 */
 
 
  //-----------------------------------------------------------------------------
// Game_Enemy
//=============================================================================

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

Game_Enemy.prototype.performAttack = function() {
            this.requestMotion(Rexal.ASVE._motion);
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
// Sprite_EnemyRex
//=============================================================================

function Sprite_EnemyRex() {
    this.initialize.apply(this, arguments);
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


Sprite_EnemyRex.prototype.damageOffsetX = function() {
    return 32;
};

Sprite_EnemyRex.prototype.stepForward = function() {
    this.startMove(48, 0, 12);
};

Sprite_EnemyRex.prototype.stepBack = function() {
    this.startMove(0, 0, 12);
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
		
		}
		
			
		}
		

};