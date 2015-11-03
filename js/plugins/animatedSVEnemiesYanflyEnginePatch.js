//=============================================================================
// AnimatedEnemiesYanflyCompatability.js
// Version: 1.016
//=============================================================================

var Imported = Imported || {};
Imported.AnimatedSVEnemies.Yanfly = true;

var Rexal = Rexal || {};
Rexal.ASVE = Rexal.ASVE || {};
/*:
 * @plugindesc Version: 1.016
 * - Makes animatedSVEnemies compatible with Yanfly's plugins.
 * @author Rexal
 *
 * @help

 Version Log:
 
 v1 - Initial Version
 v1.01 - got rid of an unnecessary function.
 v1.011 - Forgot a bracket.
 v1.012b - Should be compatible with the lastest Battle Engine Core.
 v1.013 - fixed floating monsters
 v1.014 - fixed mouse support...but you can't mix up the enemy types.
 v1.015a - Did some cleaning.
 v1.016 - Clicking should be fixed now.
 - Flinching is fixed.
 */
 if(Imported.AnimatedSVEnemies){



  //-----------------------------------------------------------------------------
// Battle Engine Core
//=============================================================================

if(Imported.YEP_BattleEngineCore)
{
	
	
	Game_Enemy.prototype.spriteWidth = function() {
		
    if(!this.battler()) return 1;
	
	if(this._animated)Rexal.log(this.battlerName() + ' is an SV Battler.','info'); else Rexal.log(this.battlerName() + " isn't an SV Battler.",'info');
	if (this._animated && this.battler()._mainSprite) {
			return this.battler()._mainSprite.width;
		} else {
			return this.battler().width;
		}
		
};

Game_Enemy.prototype.spriteHeight = function() {

	    if(!this.battler()) return 1;
		
    if (this._animated && this.battler()._mainSprite) {
			return this.battler()._mainSprite.height;
		} else {
			return this.battler().height;
		}
		
};
	
Sprite_EnemyRex.prototype.stepFlinch = function() {
		var flinchX = this.x - this._homeX - Yanfly.Param.BECFlinchDist;
		this.startMove(flinchX, 0, 6);
};

	
	Sprite_EnemyRex.prototype.stepForward = function() {
    this.startMove(Yanfly.Param.BECStepDist, 0, 12);
};




}



 }