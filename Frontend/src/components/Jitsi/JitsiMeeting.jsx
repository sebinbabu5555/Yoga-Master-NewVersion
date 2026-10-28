import React, { useEffect, useRef, useState } from 'react'

const JitsiMeeting = ({
  roomName,
  displayName,
  email,
  isInstructor,
  onClose,
  className
}) => {
  const containerRef = useRef(null)
  const apiRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let script = document.getElementById('jitsi-external-api')

    const initJitsi = () => {
      if (!window.JitsiMeetExternalAPI || !containerRef.current) return
      if (apiRef.current) {
        apiRef.current.dispose()
      }

      const domain = 'meet.jit.si'
      const options = {
        roomName: roomName,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        lang: 'en',
        userInfo: {
          displayName: displayName || (isInstructor ? 'Yoga Instructor (Host)' : 'Yoga Student'),
          email: email || ''
        },
        configOverwrite: {
          defaultLanguage: 'en',
          disableLanguageDetection: true,
          startWithAudioMuted: !isInstructor, // Students start with mic muted to avoid noise
          startWithVideoMuted: false, // Video allowed so instructor can check yoga poses
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          enableWelcomePage: false,
          disableInviteFunctions: true,
          hideConferenceSubject: false,
          enableClosePage: false,
          toolbarButtons: [
            'microphone',
            'camera',
            'chat',
            'raisehand',
            'tileview',
            'fullscreen',
            'hangup',
            'videoquality',
            'select-background'
          ]
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Yogi',
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'chat',
            'raisehand',
            'tileview',
            'fullscreen',
            'hangup',
            'videoquality',
            'select-background'
          ]
        }
      }

      const api = new window.JitsiMeetExternalAPI(domain, options)
      apiRef.current = api
      setLoading(false)

      // Ensure language is explicitly switched to English
      try {
        api.executeCommand('setLanguage', 'en')
      } catch (e) {}

      api.addEventListener('videoConferenceJoined', () => {
        try {
          api.executeCommand('setLanguage', 'en')
        } catch (e) {}
      })

      if (onClose) {
        api.addEventListener('readyToClose', onClose)
      }
    }

    if (!script) {
      script = document.createElement('script')
      script.id = 'jitsi-external-api'
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = initJitsi
      document.body.appendChild(script)
    } else if (window.JitsiMeetExternalAPI) {
      initJitsi()
    } else {
      script.addEventListener('load', initJitsi)
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }
    }
  }, [roomName, displayName, email, isInstructor])

  return (
    <div className={`relative w-full h-[650px] bg-navy rounded-card overflow-hidden shadow-xl border border-border-ui ${className || ''}`}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy text-white z-10">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold text-teal-100">Connecting to Yoga Studio Live Room...</p>
          <p className="text-xs text-white/50 mt-1">Please allow camera & microphone access in your browser.</p>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}

export default JitsiMeeting
