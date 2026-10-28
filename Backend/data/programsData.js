// Curated free goal-oriented yoga & fitness programs per promt.docx (Sections 8, 12 & 36)
// Enhanced with visual imagery and video demonstrations for every workout sequence

const VIDEO_DEMOS = {
  plank: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-the-plank-exercise-41261-large.mp4',
  flow: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-a-mat-41262-large.mp4',
  breath: 'https://assets.mixkit.co/videos/preview/mixkit-woman-meditating-in-nature-41263-large.mp4',
  stretch: 'https://assets.mixkit.co/videos/preview/mixkit-woman-stretching-her-body-on-a-yoga-mat-41260-large.mp4',
  dynamic: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-stretching-exercises-on-a-mat-41258-large.mp4',
};

const EXERCISE_IMAGES = {
  plank: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
  catCow: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
  warrior: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80',
  childPose: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80',
  downDog: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
  hips: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
  breath: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
  cardio: 'https://images.unsplash.com/photo-1552196563-55246c789077?w=600&auto=format&fit=crop&q=80',
  bridge: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&auto=format&fit=crop&q=80',
  boat: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80',
  sidePlank: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
  sphinx: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
};

const FREE_PROGRAMS = [
  {
    id: 'core-strength-60',
    title: '60-Day Core, Abs & Functional Strength',
    subtitle: 'Progressive bodyweight isometric & dynamic power protocol',
    durationDays: 60,
    dailyMinutes: 25,
    level: 'All Levels (Progressive)',
    primaryGoal: 'Strength & Toning',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending 60-Day Challenge',
    badgeColor: 'bg-coral-100 text-coral',
    overview: 'Inspired by progressive core conditioning, this 60-day journey systematically builds abdominal endurance, transverse stability, and full-body posture support without requiring equipment.',
    benefits: [
      'Sculpt transverse abdominis and oblique stabilizers',
      'Eliminate lower back strain by strengthening the anterior core',
      'Progressive challenge from foundational planks to advanced arm-balance preps',
      'Daily 20-25 minute workouts with built-in active recovery days'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Foundations & Isometric Activation',
        focus: 'Plank alignment, Navasana holds, pelvic floor connection',
        days: [
          {
            day: 1,
            title: 'Foundational Core Awakening',
            minutes: 20,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Cat-Cow Core Pacing',
                duration: '2 min (10 cycles)',
                target: 'Spinal Articulation & Transverse Core',
                cue: 'Inhale arching thoracic spine, exhale contracting navel deeply to spine.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Forearm Plank Isometric Hold',
                duration: '3 sets × 45 sec',
                target: 'Anterior Core & Shoulder Girdle',
                cue: 'Stack shoulders directly over elbows. Press heels back and brace abdominal wall.',
                image: EXERCISE_IMAGES.plank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Bird-Dog Cross Reaches',
                duration: '12 reps / side',
                target: 'Posterior Chain & Anti-Rotation',
                cue: 'Extend opposite arm and leg while keeping pelvis parallel to the mat.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Child\'s Pose Spinal Decompression',
                duration: '3 min',
                target: 'Lumbar Spine & Parasympathetic Recovery',
                cue: 'Sink hips to heels, crawl fingertips forward, breathe deep into back ribs.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          },
          {
            day: 2,
            title: 'Oblique & Lateral Stability',
            minutes: 22,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Side Plank Lateral Alignment',
                duration: '30 sec / side',
                target: 'Obliques & Quadratus Lumborum',
                cue: 'Stack hips vertically, engage bottom oblique, reach top arm toward sky.',
                image: EXERCISE_IMAGES.sidePlank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Thread-the-Needle Rotary Mobility',
                duration: '5 reps / side',
                target: 'Thoracic Spine Rotation',
                cue: 'Slide arm through space under chest, gently resting temple on mat.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Supine Bicycle Twists',
                duration: '20 controlled reps',
                target: 'Internal & External Obliques',
                cue: 'Rotate from ribcage, not elbows. Keep lower back glued to the floor.',
                image: EXERCISE_IMAGES.boat,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Supine Twist Cool-Down',
                duration: '3 min',
                target: 'Spinal Neutrality',
                cue: 'Drop knees to one side, look opposite direction with relaxed breathing.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          },
          {
            day: 3,
            title: 'Active Recovery & Breath Reset',
            minutes: 15,
            intensity: 'Light',
            exercises: [
              {
                name: 'Diaphragmatic Belly Breathing',
                duration: '5 min',
                target: 'Vagus Nerve & Diaphragm',
                cue: 'Place hands on belly. Inhale for 4s expanding abdomen, exhale for 6s.',
                image: EXERCISE_IMAGES.breath,
                videoUrl: VIDEO_DEMOS.breath
              },
              {
                name: 'Sphinx Pose Lumbar Extension',
                duration: '2 min hold',
                target: 'Lumbar Spine & Anterior Abdomen',
                cue: 'Rest on forearms, pull chest forward through shoulders without pinching spine.',
                image: EXERCISE_IMAGES.sphinx,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Gentle Happy Baby Pose',
                duration: '3 min',
                target: 'Hip Flexors & Sacrum Release',
                cue: 'Grab outer edges of feet, draw knees down towards armpits, relax tailbone.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Savasana Restorative Integration',
                duration: '5 min',
                target: 'Systemic Nervous System Recovery',
                cue: 'Allow all muscular tension to dissolve completely into the floor.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          },
          {
            day: 4,
            title: 'Lower Abdominal & Hip Flexor Control',
            minutes: 25,
            intensity: 'High',
            exercises: [
              {
                name: 'Slow Leg Lower Progressions',
                duration: '12 controlled reps',
                target: 'Lower Rectus Abdominis',
                cue: 'Maintain posterior pelvic tilt. Stop lowering if lower back begins to arch.',
                image: EXERCISE_IMAGES.plank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Navasana (Boat Pose Holds)',
                duration: '4 sets × 30 sec',
                target: 'Transverse Core & Hip Flexors',
                cue: 'Balance on sit bones with chest elevated and spine straight. Microbend knees if needed.',
                image: EXERCISE_IMAGES.boat,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Bridge Pose Glute Drive',
                duration: '15 reps with 2s squeeze',
                target: 'Gluteus Maximus & Hamstrings',
                cue: 'Press through heels, elevate hips until knees, hips and shoulders form a line.',
                image: EXERCISE_IMAGES.bridge,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Seated Forward Fold Lengthening',
                duration: '3 min',
                target: 'Hamstrings & Posterior Chain',
                cue: 'Fold from hip creases rather than rounding back. Keep spine elongated.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.flow
              }
            ]
          },
          {
            day: 5,
            title: 'Dynamic Vinyasa Core Flow',
            minutes: 25,
            intensity: 'High',
            exercises: [
              {
                name: 'Sun Salutation A Flow',
                duration: '5 continuous rounds',
                target: 'Full Body Kinetic Chain',
                cue: 'Inhale reach up, exhale forward fold, step back to chaturanga, up dog to down dog.',
                image: EXERCISE_IMAGES.cardio,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Knee-to-Nose Plank Drives',
                duration: '10 reps / side',
                target: 'Deep Abdominal Compression',
                cue: 'From downward dog, sweep knee to chest, rounding upper back in high plank.',
                image: EXERCISE_IMAGES.plank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Warrior III Stability Hold',
                duration: '5 deep breaths / side',
                target: 'Core Anti-Rotational Balance',
                cue: 'Hinge forward on standing leg, forming a T-shape with body. Square hip bones.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Downward-Facing Dog Pedaling',
                duration: '3 min',
                target: 'Calves, Hamstrings & Spine',
                cue: 'Press hands firmly into mat, pedal heels alternately to stretch calves and fascia.',
                image: EXERCISE_IMAGES.downDog,
                videoUrl: VIDEO_DEMOS.stretch
              }
            ]
          },
          {
            day: 6,
            title: 'Isometric Endurance Test',
            minutes: 20,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Cumulative Forearm Plank Challenge',
                duration: '3 minutes total work',
                target: 'Full Body Isometric Stamina',
                cue: 'Break into 60s segments if needed. Maintain neutral neck and tight glutes.',
                image: EXERCISE_IMAGES.plank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Hollow Body Hold',
                duration: '4 sets × 20 sec',
                target: 'Gymnastic Anterior Core',
                cue: 'Press lumbar spine into floor, raise arms and legs 6 inches off ground.',
                image: EXERCISE_IMAGES.boat,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Cobra Pose Spine Relief',
                duration: '2 min',
                target: 'Anterior Abdominal Stretch',
                cue: 'Gently lift chest off floor using back muscles, keeping elbows hugging ribs.',
                image: EXERCISE_IMAGES.sphinx,
                videoUrl: VIDEO_DEMOS.flow
              }
            ]
          },
          {
            day: 7,
            title: 'Rest & Myofascial Release',
            minutes: 15,
            intensity: 'Rest',
            exercises: [
              {
                name: 'Passive Full-Body Rest',
                duration: '10 min',
                target: 'Cellular Recovery & Muscle Protein Synthesis',
                cue: 'Completely relax all major muscle groups without physical exertion.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              },
              {
                name: 'Hydration & Mobility Check-In',
                duration: '5 min',
                target: 'Habit Calibration',
                cue: 'Hydrate with electrolytes and reflect on Week 1 core progress.',
                image: EXERCISE_IMAGES.breath,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          }
        ]
      },
      {
        weekNumber: 2,
        theme: 'Transverse Abdominis & Posterior Chain',
        focus: 'Strengthening the corset muscles that pull in the waist and support lumbar spine',
        days: [
          {
            day: 8,
            title: 'Deep Core Vacuum & Pelvic Tilt',
            minutes: 20,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Stomach Vacuum Breathwork',
                duration: '4 sets × 15 sec holds',
                target: 'Transverse Abdominis Compression',
                cue: 'Exhale all air completely, draw navel in and upward toward ribs.',
                image: EXERCISE_IMAGES.breath,
                videoUrl: VIDEO_DEMOS.breath
              },
              {
                name: 'Dead-Bug Cross Reaches',
                duration: '16 slow reps',
                target: 'Contralateral Core Stabilization',
                cue: 'Lower opposite arm and leg simultaneously while gluing lower back down.',
                image: EXERCISE_IMAGES.plank,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Forearm Plank Body Saws',
                duration: '12 controlled reps',
                target: 'Dynamic Core Leverage',
                cue: 'Rock forward and backward on toes while maintaining rigid plank.',
                image: EXERCISE_IMAGES.plank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Extended Child\'s Pose',
                duration: '3 min',
                target: 'Spinal Decompression',
                cue: 'Breathe deep into back ribcage.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          },
          {
            day: 9,
            title: 'Rotational Strength Flow',
            minutes: 25,
            intensity: 'High',
            exercises: [
              {
                name: 'Revolved Low Lunge',
                duration: '5 deep breaths / side',
                target: 'Thoracic Mobility & Psoas',
                cue: 'Twist torso toward front knee, palms pressed in prayer.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Side Plank Hip Dips',
                duration: '10 reps / side',
                target: 'Lower Obliques & Hip Abductors',
                cue: 'Lower hip 2 inches, then power it back up toward ceiling.',
                image: EXERCISE_IMAGES.sidePlank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Russian Twists in Boat Pose',
                duration: '20 controlled reps',
                target: 'Rotational Abdominal Power',
                cue: 'Rotate shoulders fully from left to right while balancing.',
                image: EXERCISE_IMAGES.boat,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Corpse Pose Wind-Down',
                duration: '3 min',
                target: 'Recovery',
                cue: 'Full relaxation.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          },
          {
            day: 10,
            title: 'Postural Spine Decompression',
            minutes: 18,
            intensity: 'Light',
            exercises: [
              {
                name: 'Locust Pose (Salabhasana)',
                duration: '3 sets × 10 sec holds',
                target: 'Erector Spinae & Posterior Chain',
                cue: 'Lift chest, arms and legs off mat using back power.',
                image: EXERCISE_IMAGES.sphinx,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Puppy Pose Chest Opener',
                duration: '2 min hold',
                target: 'Thoracic Extension',
                cue: 'Hips over knees, walk hands forward and melt chest to mat.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Cat-Cow Spinal Waves',
                duration: '15 slow rounds',
                target: 'Vertebral Fluidity',
                cue: 'Link movement to smooth breath.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.flow
              }
            ]
          },
          {
            day: 11,
            title: 'Power Plank Circuit',
            minutes: 25,
            intensity: 'High',
            exercises: [
              {
                name: 'High Plank Shoulder Taps',
                duration: '20 reps total',
                target: 'Anti-Rotational Stability',
                cue: 'Tap opposite shoulder without letting hips sway.',
                image: EXERCISE_IMAGES.plank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Dolphin Push-Ups',
                duration: '10 reps',
                target: 'Serratus Anterior & Shoulders',
                cue: 'From dolphin pose, shift chin past thumbs and press back up.',
                image: EXERCISE_IMAGES.downDog,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Forearm Plank Final Hold',
                duration: '60 sec burnout',
                target: 'Deep Core Endurance',
                cue: 'Breathe through the burn, keep tailbone tucked.',
                image: EXERCISE_IMAGES.plank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Sphinx Pose Relief',
                duration: '2 min',
                target: 'Anterior Decompression',
                cue: 'Open chest.',
                image: EXERCISE_IMAGES.sphinx,
                videoUrl: VIDEO_DEMOS.stretch
              }
            ]
          },
          {
            day: 12,
            title: 'Balance & Core Integration',
            minutes: 25,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Warrior II to Reverse Warrior',
                duration: '5 flowing rounds / side',
                target: 'Leg Stamina & Lateral Core',
                cue: 'Keep front knee tracking over second toe, reach back arm down back leg.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Half Moon (Ardha Chandrasana)',
                duration: '30 sec / side',
                target: 'Glute Medius & Core Balance',
                cue: 'Stack hips, flex floating foot, reach top hand to sky.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Standing Knee Drives',
                duration: '15 reps / side',
                target: 'Psoas & Lower Core',
                cue: 'Drive knee up to chest with power.',
                image: EXERCISE_IMAGES.cardio,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Standing Forward Fold',
                duration: '2 min',
                target: 'Hamstring & Spinal Lengthening',
                cue: 'Let head hang heavy.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              }
            ]
          },
          {
            day: 13,
            title: 'Total Abdominal Burn',
            minutes: 25,
            intensity: 'High',
            exercises: [
              {
                name: 'V-Up Progressions',
                duration: '10 controlled reps',
                target: 'Upper & Lower Abdomen',
                cue: 'Reach hands toward toes folding in a V-shape.',
                image: EXERCISE_IMAGES.boat,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Mountain Climbers Tempo',
                duration: '40 sec fast block',
                target: 'Cardio & Core Drive',
                cue: 'Drive knees to chest rhythmically.',
                image: EXERCISE_IMAGES.cardio,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Side Plank Reach-Throughs',
                duration: '10 reps / side',
                target: 'Rotational Oblique Control',
                cue: 'Thread top arm under body and reach back up.',
                image: EXERCISE_IMAGES.sidePlank,
                videoUrl: VIDEO_DEMOS.plank
              },
              {
                name: 'Twisting Pigeon Pose',
                duration: '2 min / side',
                target: 'Glute & IT Band Release',
                cue: 'Rest torso over front shin.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              }
            ]
          },
          {
            day: 14,
            title: 'Weekly Milestone Check & Rest',
            minutes: 15,
            intensity: 'Rest',
            exercises: [
              {
                name: 'Active Rest & Recovery Walk',
                duration: '10 min',
                target: 'Lymphatic Drainage',
                cue: 'Gentle easy movement.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              },
              {
                name: 'Pranayama Relaxation Pacing',
                duration: '5 min',
                target: 'Nervous System Reset',
                cue: '4-7-8 deep breathing.',
                image: EXERCISE_IMAGES.breath,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mobility-posture-30',
    title: '30-Day Mobility & Posture Reset',
    subtitle: 'Desk-fatigue reversal, thoracic decompression & hip freedom',
    durationDays: 30,
    dailyMinutes: 20,
    level: 'Beginner to Intermediate',
    primaryGoal: 'Posture Correction',
    category: 'Posture',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    tag: 'Desk Worker Essential',
    badgeColor: 'bg-teal-100 text-teal',
    overview: 'Engineered specifically for individuals who spend long hours sitting. Counteract forward head posture, rounded shoulders, tight hip flexors, and lower back stiffness with targeted 20-minute daily mobility protocols.',
    benefits: [
      'Decompress cervical and thoracic spine vertebrae',
      'Open tight anterior hip flexors and restore glute activation',
      'Correct rounded shoulder carriage with scapular retraction',
      'Noticeable posture improvement within 14 days'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Neck, Shoulders & Upper Spine Awakening',
        focus: 'Reversing text-neck and forward head carriage',
        days: [
          {
            day: 1,
            title: 'Neck & Cervical Spine Release',
            minutes: 18,
            intensity: 'Light',
            exercises: [
              {
                name: 'Cervical Retraction (Chin Tucks)',
                duration: '15 slow reps',
                target: 'Deep Neck Flexors',
                cue: 'Glide head straight back without tilting chin down, reversing text-neck posture.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Upper Trapezius Gentle Stretches',
                duration: '1 min / side',
                target: 'Trapezius & Levator Scapulae',
                cue: 'Rest ear towards shoulder, keep opposite shoulder relaxed downward.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Eagle Arms Scapular Spread',
                duration: '5 breaths / side',
                target: 'Rhomboids & Posterior Shoulders',
                cue: 'Cross elbows and intertwine palms, lifting elbows to shoulder height.',
                image: EXERCISE_IMAGES.breath,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Corpse Pose Neutral Spine Rest',
                duration: '3 min',
                target: 'Postural Reset',
                cue: 'Lay completely flat with neck relaxed and natural spine curvature.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          },
          {
            day: 2,
            title: 'Thoracic Extension & Chest Opening',
            minutes: 20,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Cactus Arm Wall Slides',
                duration: '12 controlled reps',
                target: 'Pectoralis Major & Scapular Depressors',
                cue: 'Flatten back against wall, slide elbows up while keeping wrists touching wall.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Puppy Pose with Blocks',
                duration: '2 min hold',
                target: 'Thoracic Spine Extension',
                cue: 'Elevate hands on blocks or mat, melt heart downward toward floor.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Thread the Needle Rotations',
                duration: '6 reps / side',
                target: 'Mid-Back Spinal Rotators',
                cue: 'Slide arm under torso, breathing deeply into upper shoulder blade.',
                image: EXERCISE_IMAGES.catCow,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Sphinx Pose Chest Lift',
                duration: '2 min',
                target: 'Anterior Chest & Spine',
                cue: 'Press palms down, broaden collarbones and look forward.',
                image: EXERCISE_IMAGES.sphinx,
                videoUrl: VIDEO_DEMOS.flow
              }
            ]
          },
          {
            day: 3,
            title: 'Hip Flexor Freedom',
            minutes: 20,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Low Lunge with Psoas Reach',
                duration: '1 min / side',
                target: 'Iliopsoas & Rectus Femoris',
                cue: 'Tuck tailbone, shift pelvis forward, and reach arm on back-leg side overhead.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Half Kneeling Quad Stretch',
                duration: '1 min / side',
                target: 'Quadriceps & Hip Capsule',
                cue: 'Gently catch rear foot, maintaining tall upright torso.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Glute Bridges for Pelvic Alignment',
                duration: '15 reps',
                target: 'Gluteus Maximus & Pelvic Stabilizers',
                cue: 'Drive through heels to wake up sleepy glutes caused by prolonged sitting.',
                image: EXERCISE_IMAGES.bridge,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Restorative Child\'s Pose',
                duration: '3 min',
                target: 'Lower Back Relief',
                cue: 'Rest forehead on mat and relax.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'flexibility-hamstring-21',
    title: '21-Day Flexibility & Lower Body Range',
    subtitle: 'Hip openers, deep hamstring lengthening & fascia release',
    durationDays: 21,
    dailyMinutes: 25,
    level: 'All Levels',
    primaryGoal: 'Build Flexibility & Mobility',
    category: 'Flexibility',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    tag: 'High Demand',
    badgeColor: 'bg-blue-ai-100 text-blue-ai',
    overview: 'A scientifically structured progressive flexibility journey designed to safely unlock tight hamstrings, open stiff hips, and expand functional range of motion without overstretching ligaments.',
    benefits: [
      'Increase hamstring length by up to 25% safely',
      'Unlock stubborn hip rotators and relieve lower back tightness',
      'Master the foundational forward folds, lunges, and splits prep',
      'Yin-inspired long holds targeting connective fascia tissue'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Hamstrings & Posterior Chain Opening',
        focus: 'Gentle progressive lengthening without rounding the lumbar spine',
        days: [
          {
            day: 1,
            title: 'Safe Hamstring Warmup & Alignment',
            minutes: 22,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Standing Calf & Hamstring Pedals',
                duration: '2 min',
                target: 'Gastrocnemius & Achilles Tendon',
                cue: 'In downward dog, pedal heels down rhythmically to warm calf muscles.',
                image: EXERCISE_IMAGES.downDog,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Half-Splits (Ardha Hanumanasana)',
                duration: '1 min / side',
                target: 'Biceps Femoris & Semitendinosus',
                cue: 'Hinge over straight front leg, flexing toes back towards face. Keep spine flat.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Pyramid Pose Microbend',
                duration: '1 min / side',
                target: 'Hamstring Origin & Glutes',
                cue: 'Square both hip points forward, fold torso over front leg with soft knee.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Supine Hamstring Strap Stretch',
                duration: '2 min / side',
                target: 'Full Posterior Chain Fascia',
                cue: 'Loop strap around ball of foot, keep opposite leg anchored to ground.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              }
            ]
          },
          {
            day: 2,
            title: 'Hip Capsule & Outer Rotators',
            minutes: 25,
            intensity: 'Moderate',
            exercises: [
              {
                name: 'Supine Figure 4 Stretch',
                duration: '1.5 min / side',
                target: 'Piriformis & Glute Medius',
                cue: 'Cross ankle over opposite knee, thread hands through to hug thigh to chest.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Pigeon Pose Alignment & Hold',
                duration: '2 min / side',
                target: 'Deep Hip Rotators & IT Band',
                cue: 'Square hips to front, lengthen rear leg straight back, fold forward onto forearms.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Lizard Pose Inner Groin Release',
                duration: '90 sec / side',
                target: 'Hip Adductors & Psoas',
                cue: 'Step foot to outside of hands, sink hips downward with relaxed breath.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Restorative Child\'s Pose',
                duration: '3 min',
                target: 'Nervous System Integration',
                cue: 'Full body rest.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'stress-nervous-system-14',
    title: '14-Day Stress Relief & Breathwork Protocol',
    subtitle: 'Vagal nerve stimulation, Pranayama & restorative recovery',
    durationDays: 14,
    dailyMinutes: 18,
    level: 'All Levels',
    primaryGoal: 'Stress Relief & Mental Wellness',
    category: 'Recovery',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80',
    tag: 'Nervous System Reset',
    badgeColor: 'bg-teal-100 text-teal',
    overview: 'Down-regulate your sympathetic "fight or flight" response with proven breath pacing, parasympathetic activation, and restorative postures designed for deep sleep and daily calm.',
    benefits: [
      'Lower resting cortisol and balance heart rate variability',
      'Improve sleep quality and fall asleep up to 40% faster',
      'Learn diaphragmatic box breathing and Ujjayi breath control',
      'Zero athletic fatigue — pure physical recovery'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Parasympathetic Down-Regulation',
        focus: 'Exhalation lengthening to trigger the vagus nerve relaxation response',
        days: [
          {
            day: 1,
            title: '4-7-8 Breath & Diaphragmatic Awakening',
            minutes: 15,
            intensity: 'Gentle',
            exercises: [
              {
                name: 'Hand-on-Heart Diaphragm Pacing',
                duration: '5 min',
                target: 'Vagus Nerve Stimulation',
                cue: 'Inhale quietly through nose for 4s, hold gently for 7s, exhale completely through mouth for 8s.',
                image: EXERCISE_IMAGES.breath,
                videoUrl: VIDEO_DEMOS.breath
              },
              {
                name: 'Supported Child\'s Pose with Pillow',
                duration: '5 min',
                target: 'Sympathetic Nervous Down-Regulation',
                cue: 'Wrap arms around a bolster or pillow, resting forehead sideways and breathing slow.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.breath
              },
              {
                name: 'Legs-Up-The-Wall (Viparita Karani)',
                duration: '5 min',
                target: 'Venous Return & Cortisol Reduction',
                cue: 'Scoot hips close to wall, extend legs vertically, rest arms in a goalpost cactus shape.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              }
            ]
          },
          {
            day: 2,
            title: 'Evening Unwind & Sleep Induction',
            minutes: 20,
            intensity: 'Gentle',
            exercises: [
              {
                name: 'Reclining Bound Angle Pose (Supta Baddha Konasana)',
                duration: '5 min',
                target: 'Pelvic Diaphragm & Adductor Release',
                cue: 'Soles of feet together, knees splay open gently supported by blankets.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Supine Gentle Spinal Twists',
                duration: '3 min / side',
                target: 'Vertebral Tension Release',
                cue: 'Drop knees softly to the side, breathing slow nasal breaths.',
                image: EXERCISE_IMAGES.childPose,
                videoUrl: VIDEO_DEMOS.stretch
              },
              {
                name: 'Progressive Muscle Relaxation',
                duration: '5 min',
                target: 'Full Body Neuromuscular Release',
                cue: 'Tense each muscle group for 3s, then release completely upon exhalation.',
                image: EXERCISE_IMAGES.breath,
                videoUrl: VIDEO_DEMOS.breath
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'weight-conditioning-45',
    title: '45-Day Weight Management & Metabolic Flow',
    subtitle: 'High-tempo active Vinyasa, cardiovascular output & stamina',
    durationDays: 45,
    dailyMinutes: 30,
    level: 'Intermediate',
    primaryGoal: 'Weight Management',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1552196563-55246c789077?w=600&auto=format&fit=crop&q=80',
    tag: 'High Energy',
    badgeColor: 'bg-coral-100 text-coral',
    overview: 'Turn your yoga mat into a high-efficiency metabolic conditioning studio. Continuous breath-linked movement, power transitions, and bodyweight intervals keep your heart rate elevated and burn calories effectively.',
    benefits: [
      'Elevate resting metabolic rate through continuous multi-joint compound movement',
      'Build lean muscular definition across shoulders, core, glutes, and legs',
      'Enhance cardiovascular stamina without high-impact joint wear',
      'Burn 250-400 calories per session'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Metabolic Ignition & Tempo Building',
        focus: 'Seamless transitions and active core engagement',
        days: [
          {
            day: 1,
            title: 'Power Sun Salutations Tempo',
            minutes: 28,
            intensity: 'High',
            exercises: [
              {
                name: 'Sun Salutation A Fast Flow',
                duration: '5 continuous rounds',
                target: 'Cardiovascular Conditioning',
                cue: 'Move at brisk breath tempo, jumping back to chaturanga with elbows in.',
                image: EXERCISE_IMAGES.cardio,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Sun Salutation B Jump-Backs',
                duration: '4 rounds with Chair Poses',
                target: 'Quadriceps, Glutes & Deltoids',
                cue: 'Sink deep into Utkatasana chair pose, sink hips, keep arms framing ears.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Chair Pose Pulsing Holds',
                duration: '3 sets × 30 sec pulses',
                target: 'Gluteus Medius & Isometric Stamina',
                cue: 'Pulse 2 inches up and down without letting knees collapse inward.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Cool-Down Standing Forward Fold',
                duration: '2 min',
                target: 'Heart Rate Normalization',
                cue: 'Breathe smoothly through nose to bring heart rate down.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              }
            ]
          },
          {
            day: 2,
            title: 'Legs, Glutes & Isometric Burn',
            minutes: 30,
            intensity: 'High',
            exercises: [
              {
                name: 'Warrior II to Goddess Squat Transitions',
                duration: '15 dynamic reps',
                target: 'Hip Abductors & Core',
                cue: 'Pivot smoothly between Warrior II and deep Goddess stance with toes flared 45 degrees.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.flow
              },
              {
                name: 'Warrior III Dynamic Airplane Pulses',
                duration: '10 pulses / side',
                target: 'Posterior Chain & Hamstring Drive',
                cue: 'Pulse back leg up using glute squeeze, keeping chest parallel to floor.',
                image: EXERCISE_IMAGES.warrior,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Modified Lunge Jump Switches',
                duration: '12 explosive reps',
                target: 'Fast-Twitch Muscle Fibers',
                cue: 'Jump or step softly between lunges, landing with knees bent at 90 degrees.',
                image: EXERCISE_IMAGES.cardio,
                videoUrl: VIDEO_DEMOS.dynamic
              },
              {
                name: 'Wide-Legged Forward Fold Recovery',
                duration: '3 min',
                target: 'Adductor & Spine Lengthening',
                cue: 'Rest hands on floor, letting torso drape downward.',
                image: EXERCISE_IMAGES.hips,
                videoUrl: VIDEO_DEMOS.stretch
              }
            ]
          }
        ]
      }
    ]
  }
];

module.exports = { FREE_PROGRAMS };
