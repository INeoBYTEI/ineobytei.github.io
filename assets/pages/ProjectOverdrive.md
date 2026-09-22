# Project Overdrive [DEMO]

**Project Overdrive** is a high-speed sci-fi action platformer where you build momentum through fluid movement and high-octane combat while facing colossal creatures.

Play as Laila, a cybernetically enhanced badass who finds herself in a dangerous crater overrun by alien spawn. Defeat enemies to increase speed and charge your Overdrive, all while avoiding devastating attacks from massive bosses hunting you throughout each battlefield. 

Inspired by games such as Haste: Broken Worlds, Vampire Survivors, Shadow of the Colossus  and character action games.

[![Project Overdrive](https://img.youtube.com/vi/AkgLkKMUQdQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=AkgLkKMUQdQ)
Click to see the trailer

[Check out the Demo here](https://yrgo.itch.io/overdrive)

## About this game

Built in Unity 6.3 (12 weeks).
A team of 8 — 4 programmers, 3 artists, 1 composer.
I served as **Game Director** and **General Programmer**, with a focus on **gameplay systems, combat, player movement** and **game feel**. I also coordinated development across disciplines, helped define the project's scope and design direction, and directed the game's trailer and promotional presentation.

My goal throughout development was to connect the technical implementation with the intended player experience: fast, expressive combat that makes the player feel powerful and constantly in motion.

### My contributions

- Player Combat Mechanics
- Player Animation Integration
- User Experience and Feedback
- Minor Enemy Optimization
- Game Trailer
- Animation

### Design philosophy

<!--[Explain what the game is trying to make the player feel.]

[Explain the player fantasy.]

[Explain the particular gameplay/game-feel/design decisions you made to achieve that.]

[Optional: explain the game's visual/narrative identity and how mechanics support it.]

[Play on itch.io]-->

## Postmortem

### Scope & goals

<!--[What was the original pitch?]

[What were you trying to achieve?]

[What was the most important experience you wanted the player to have?]

[What changed during development and why?]-->

### What went well?

[Specific system, design decision, workflow, team process, or technical solution that worked particularly well.]

[Explain why it worked.]

### What went wrong?

[Technical/design/team problem.]

[What caused it?]

[How did you solve it, or what would you do differently next time?]

### Takeaways

[What did YOU learn from the project?]

[How did your programming/design skills develop?]

[How did your leadership skills develop?]

[What would you approach differently on the next project?]

## Technical Overview

### Player Attack Handler
I wanted the attack to feel increasingly dramatic as the player committed to it. The attack slows time, widens the camera's FOV, then rapidly chains through marked enemies. Attack timing is also influenced by player velocity, making the sequence feel faster and more aggressive when the player enters it at high speed.
```csharp
IEnumerator PerformAttackSequence()
    {
        if (_playerMarkHandler._detectedTargets.Count == 0)
        {
            _isAttacking = false;
            yield break; // No targets detected, exit the coroutine
        }
        _playerAnimationHandler._animator.SetTrigger("Detonate");
        ScreenEffectHandler screenEffectHandler = ScreenEffectHandler.Instance;
        screenEffectHandler.AttackScreenEffect(_attackHitDuration * _playerMarkHandler._detectedTargets.Count + .5f);
        _playerVFXHandler.SetTrailActive(true);

        OnAttackStart.Invoke();


        // Slow down time and increase FOV for dramatic effect
        _timeScaleManager.SetTimeScale(_attackStartTimeScale);
        _dynamicCameraHandler.BounceFov(125f, 5f, 1f + 0.1f, 5f, 2, "Attack Start FOV");

        if (PausMenu.Instance.IsPaused()) { yield return new WaitForSeconds(_attackStartDuration); }
        else { yield return new WaitForSecondsRealtime(_attackStartDuration); }


        _timeScaleManager.SetTimeScale(_attackSequenceTimeScale);
        if (_playerMovementScript.GetGear() != 3)
        {
            _dynamicCameraHandler.BounceFov(125f, 5f, _attackHitDuration * _playerMarkHandler._detectedTargets.Count + .5f, 5f, 1, "Attack Sequence FOV");
        }

        
        float attackHitDurationTemp = _attackHitDuration - (_playerMovementScript.GetVelocityMagnitude() * _attackSpeedByVelocity); 
        if (attackHitDurationTemp > 0){
        foreach (DetectedTarget target in _playerMarkHandler._detectedTargets)
        {
            GameObject targetObj = target.Target;
            if (targetObj != null)
            {
                    if (PausMenu.Instance.IsPaused()) { yield return new WaitForSeconds(attackHitDurationTemp); }
                    else { yield return new WaitForSecondsRealtime(attackHitDurationTemp); }
                    
                DoAttackHit(targetObj);
            }
        }}
        
        
        _timeScaleManager.SetTimeScale(_attackStartTimeScale);

        if (_roundUp)
        {
            StartCoroutine(PerformRoundUp());
            if (PausMenu.Instance.IsPaused()) { yield return new WaitForSeconds(0.5f); }
            else { yield return new WaitForSecondsRealtime(0.5f); }

        }

        foreach (DetectedTarget target in _playerMarkHandler._detectedTargets)
        {
            GameObject targetObj = target.Target;
            if (targetObj != null)
            {
                targetObj.transform.DOKill();
                DoAttackHit(targetObj, true);
            }
        }


        if (PausMenu.Instance.IsPaused()) { yield return new WaitForSeconds(_attackEndDuration); }
        else { yield return new WaitForSecondsRealtime(_attackEndDuration); }
        

        DoAttackEnd();
        OnAttackEnd.Invoke();
    }
```
Every successful attack triggers multiple layers of feedback: VFX, positioning, camera shake, sound, and events. Separating these effects from the damage calculation allowed the attack to feel impactful without coupling the feedback systems directly to combat logic.
```csharp
void DoAttackHit(GameObject targetObj, bool dealDamage = false)
{
    _playerVFXHandler.SpawnEffect(
        targetObj.transform.position + targetObj.transform.forward,
        Quaternion.LookRotation(transform.forward));

    _playerModel.transform.position =
        targetObj.transform.position - transform.forward * 2f;

    _dynamicCameraHandler.ShakeCamera(_attackShakeIntensity, 0.075f);
    SFX.Attack.Play(SettingsROM._SFXVolume);

    if (dealDamage)
    {
        Health_Class enemyHealthComponent =
            targetObj.GetComponent<Health_Class>();

        if (enemyHealthComponent != null)
        {
            enemyHealthComponent.TakeDamage(_attackDamage);
        }
    }

    OnAttackHit.Invoke();
}
```


### Round Up Attack
![Gameplay](./RoundUp.gif)

An attack sequence that didn't make the cut to the demo was the Round Up attack. It was designed as a spatial combat sequence and an alternative pattern to the standard attack.
```csharp
Vector3 clusterCenter = CalculateClusterCenterOfMass();

foreach (DetectedTarget target in _playerMarkHandler._detectedTargets)
{
    if (target.Target != null)
    {
        target.Target.transform.DOMove(
            clusterCenter,
            0.035f
        ).SetEase(Ease.OutQuad);
    }
}
```
Marked enemies are pulled toward a shared center point as the player "Round's them Up" before executing the enemies.
```csharp
_playerModel.transform.SetParent(centerPoint.transform, true);

_playerModel.transform.DOLookAt(clusterCenter, 0.01f);

_playerModel.transform.position =
    clusterCenter - _playerModel.transform.forward * 7f;

_playerModel.transform.parent
    .DOLocalRotate(
        new Vector3(0, 720f, 0),
        0.075f,
        RotateMode.FastBeyond360)
    .SetRelative(true)
    .SetEase(Ease.InOutQuad);
```
Once the enemies have been gathered, the player is temporarily parented to a central pivot and rotated around the group. This lets the attack create a controlled visual composition while still being driven entirely through gameplay code.
This approach let me treat combat as a combination of gameplay logic and spatial choreography, feeding the power fantasy of the player without relying entirely on animation since we didn't have a dedicated animator for this project.



### Grunt Rendering Optimization
Project Overdrive could have large numbers of Grunts active simultaneously, which made rendering cost an important consideration. Instead of treating every enemy identically, I implemented camera-frustum visibility checks and used the result to dynamically adjust their visual workload.
```csharp
private bool IsVisible()
{
    if (_targetCamera == null || _renderer == null)
        return false;

    if (!TryGetLODGroupBounds(out Bounds bounds))
        return false;

    GeometryUtility.CalculateFrustumPlanes(_targetCamera, cameraPlanes);
    return GeometryUtility.TestPlanesAABB(cameraPlanes, bounds);
}
```
The visibility state then controls both the enemy's LOD and its trail effect:
```csharp
if (IsVisibleToCamera)
{
    _lodGroup.ForceLOD(-1);
    _trailRenderer.SetActive(true);
}
else
{
    _lodGroup.ForceLOD(2);
    _trailRenderer.SetActive(false);
}
```
This meant enemies outside the camera's view could fall back to a cheaper representation while visual effects such as trails were disabled entirely.

I also combined this with Unity's LODGroup system, allowing the Grunts to scale their visual complexity depending on how relevant they were to the player's current view.
