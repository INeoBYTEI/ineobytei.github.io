# Project Overdrive [DEMO]

**Project Overdrive** is a high-speed sci-fi action platformer where you build momentum through fluid movement and high-octane combat while facing colossal creatures.

Play as Laila, a cybernetically enhanced badass who finds herself in a dangerous crater overrun by alien spawn. Defeat enemies to increase speed and charge your Overdrive, all while avoiding devastating attacks from massive bosses hunting you throughout each battlefield. 

Inspired by games such as Haste: Broken Worlds, Vampire Survivors, Shadow of the Colossus  and character action games.

[![Project Overdrive](https://img.youtube.com/vi/AkgLkKMUQdQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=AkgLkKMUQdQ)
Click to see the trailer

[Gallery / screenshots]

## About this game

Built in Unity 6.3 (12 weeks).
A team of 8 — 4 programmers, 3 artists, 1 composer.
I served as **Game Director** and **General Programmer**, primarily responsible for [your major responsibilities].

### My contributions

- Player Combat Mechanics
- Player Animation Integration
- User Experience and Feedback
- [Technical problem you solved]
- [Leadership/design responsibility]
- [Other significant contribution]

### Design philosophy

[Explain what the game is trying to make the player feel.]

[Explain the player fantasy.]

[Explain the particular gameplay/game-feel/design decisions you made to achieve that.]

[Optional: explain the game's visual/narrative identity and how mechanics support it.]

[Play on itch.io]

## Postmortem

### Scope & goals

[What was the original pitch?]

[What were you trying to achieve?]

[What was the most important experience you wanted the player to have?]

[What changed during development and why?]

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

