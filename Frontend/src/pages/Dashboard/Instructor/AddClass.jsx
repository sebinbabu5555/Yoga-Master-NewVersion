import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useUser from '../../../hooks/useUser'

const KEY = import.meta.env.VITE_IMG_TOKEN
const AVAILABLE_CATEGORIES = ['Strength', 'Mobility', 'Flexibility', 'Recovery', 'Posture', 'Core', 'Balance']

// Optimize large images to ~100-200KB before uploading to avoid slow uploads
const compressImage = async (file) => {
  if (!file || !file.type.startsWith('image/') || file.size < 250 * 1024) {
    return file
  }
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX_DIM = 1200
        let { width, height } = img
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width)
            width = MAX_DIM
          } else {
            width = Math.round((width * MAX_DIM) / height)
            height = MAX_DIM
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' }))
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          0.82
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target.result
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

const AddClass = () => {
  const formRef = useRef(null)
  const fileInputRef = useRef(null)
  const axiosSecure = useAxiosSecure()
  const { currentUser, isLoading } = useUser()
  const navigate = useNavigate()

  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLevel, setSelectedLevel] = useState('Beginner')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImage(null)
      setImagePreview(null)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload optimized image to ImgBB
  const uploadImageToImgBB = async (file) => {
    const optimizedFile = await compressImage(file)
    const imgData = new FormData()
    imgData.append('image', optimizedFile)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${KEY}`, {
        method: 'POST',
        body: imgData,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      const data = await res.json()
      if (data.success && data.data?.display_url) {
        return data.data.display_url
      }
      throw new Error(data.error?.message || 'Thumbnail upload failed. Please try a different image.')
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        throw new Error('Image upload timed out. Please check your connection and try again.')
      }
      throw err
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!image) {
      Swal.fire({
        title: 'Thumbnail Required',
        text: 'Please select a thumbnail image for your course.',
        icon: 'warning',
        confirmButtonColor: '#12B8A6'
      })
      return
    }

    if (selectedCategories.length === 0) {
      Swal.fire({
        title: 'Category Required',
        text: 'Please select at least one category for your course.',
        icon: 'warning',
        confirmButtonColor: '#12B8A6'
      })
      return
    }

    setIsSubmitting(true)
    setUploadProgress('Uploading thumbnail...')

    try {
      const formData = new FormData(e.target)
      const rawData = Object.fromEntries(formData)

      // 1. Upload thumbnail quickly
      const displayUrl = await uploadImageToImgBB(image)

      // 2. Prepare course document
      setUploadProgress('Saving course...')
      const cleanCategories = selectedCategories.filter((c) => c !== 'Beginner')
      const coursePrice = parseFloat(rawData.Price) || 0
      const seats = parseInt(rawData.availableSeats, 10) || 0

      const newCourse = {
        name: rawData.name?.trim(),
        image: displayUrl,
        instructorName: currentUser?.name || 'Instructor',
        instructorEmail: currentUser?.email,
        status: 'pending',
        submitted: new Date(),
        totalEnrolled: 0,
        level: selectedLevel,
        categories: cleanCategories,
        category: cleanCategories[0] || '',
        price: coursePrice,
        Price: coursePrice,
        availableSeats: seats,
        videoLink: rawData.videoLink?.trim() || '',
        description: rawData.description?.trim() || ''
      }

      // 3. Save to backend database
      const res = await axiosSecure.post('/new-class', newCourse)

      if (res.data?.insertedId || res.status === 200) {
        // RESET FORM AND ALL STATES
        if (formRef.current) {
          formRef.current.reset()
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setImage(null)
        setImagePreview(null)
        setSelectedCategories([])
        setSelectedLevel('Beginner')

        Swal.fire({
          title: 'Course Added Successfully!',
          text: `"${newCourse.name}" has been registered and submitted for review.`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#12B8A6',
          cancelButtonColor: '#667085',
          confirmButtonText: 'View My Classes',
          cancelButtonText: 'Add Another Course'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard/my-classes')
          }
        })
      } else {
        throw new Error(res.data?.message || 'Unable to register class in database.')
      }
    } catch (err) {
      console.error('Error adding course:', err)
      Swal.fire({
        title: 'Submission Failed',
        text: err.message || 'Something went wrong while submitting the course. Please try again.',
        icon: 'error',
        confirmButtonColor: '#E5484D'
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">Add Your Course</h1>
        <p className="text-sm text-text-secondary mt-1">
          Provide complete course details to submit for admin approval.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="p-6 sm:p-8 bg-white rounded-card shadow-sm border border-border-ui space-y-6"
      >
        <div className="grid items-start w-full grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-1.5 text-xs font-bold text-text-primary">
              Course Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Vinyasa Flow"
              name="name"
              id="name"
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 text-sm border rounded-btn border-border-ui focus:outline-none focus:border-teal disabled:bg-surface-2 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-1.5 text-xs font-bold text-text-primary">
              Course Thumbnail *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              required
              accept="image/*"
              name="image"
              id="image"
              disabled={isSubmitting}
              onChange={handleImageChange}
              className="block w-full border border-border-ui rounded-btn text-xs text-text-secondary
                focus:border-teal file:border-0 file:bg-teal file:text-white file:mr-3 file:py-2.5 file:px-4 file:font-semibold file:cursor-pointer disabled:opacity-50"
            />

            {imagePreview && (
              <div className="mt-2.5 flex items-center gap-3 p-2 bg-surface-2 rounded-btn border border-border-ui">
                <img
                  src={imagePreview}
                  alt="Thumbnail Preview"
                  className="w-14 h-14 object-cover rounded-md border border-border-ui"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">{image?.name}</p>
                  <p className="text-[11px] text-text-secondary">
                    {image?.size ? `${(image.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  className="text-xs text-error font-semibold hover:underline px-2 py-1"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-medium text-text-secondary mb-2">
            Instructor Profile Details (Auto-filled)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-text-primary" htmlFor="instructorName">
                Instructor Name
              </label>
              <input
                className="w-full px-3.5 py-2.5 text-sm border rounded-btn border-border-ui bg-surface-2 text-text-secondary focus:outline-none cursor-not-allowed"
                type="text"
                value={currentUser?.name || ''}
                readOnly
                disabled
                placeholder="Instructor Name"
                name="InstructorName"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-text-primary" htmlFor="instructorEmail">
                Instructor Email
              </label>
              <input
                className="w-full px-3.5 py-2.5 text-sm border rounded-btn border-border-ui bg-surface-2 text-text-secondary focus:outline-none cursor-not-allowed"
                type="email"
                value={currentUser?.email || ''}
                readOnly
                disabled
                placeholder="Instructor Email"
                name="InstructorEmail"
              />
            </div>
          </div>
        </div>

        <div className="grid items-center w-full grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-bold text-text-primary" htmlFor="availableSeats">
              Available Seats *
            </label>
            <input
              className="w-full px-3.5 py-2.5 text-sm border rounded-btn border-border-ui focus:outline-none focus:border-teal disabled:bg-surface-2 transition-colors"
              type="number"
              min="1"
              required
              disabled={isSubmitting}
              placeholder="e.g. 25"
              name="availableSeats"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold text-text-primary" htmlFor="price">
              Price (₹ INR) *
            </label>
            <input
              className="w-full px-3.5 py-2.5 text-sm border rounded-btn border-border-ui focus:outline-none focus:border-teal disabled:bg-surface-2 transition-colors"
              type="number"
              min="0"
              step="any"
              required
              disabled={isSubmitting}
              placeholder="e.g. 499"
              name="Price"
            />
          </div>
        </div>

        <div className="grid items-start w-full grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-bold text-text-primary" htmlFor="level">
              Course Level *
            </label>
            <select
              id="level"
              name="level"
              value={selectedLevel}
              disabled={isSubmitting}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border rounded-btn border-border-ui focus:outline-none focus:border-teal bg-white disabled:bg-surface-2 transition-colors"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-text-primary">
                Categories *
              </label>
              <span className="text-[11px] font-medium text-teal">
                {selectedCategories.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-surface-2/60 rounded-btn border border-border-ui/80">
              {AVAILABLE_CATEGORIES.map((category) => {
                const isChecked = selectedCategories.includes(category)
                return (
                  <button
                    key={category}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                      isChecked
                        ? 'bg-teal text-white border-teal shadow-xs'
                        : 'bg-white text-text-secondary border-border-ui hover:border-teal hover:text-text-primary'
                    }`}
                  >
                    {isChecked ? `✓ ${category}` : `+ ${category}`}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-xs font-bold text-text-primary" htmlFor="videoLink">
            YouTube Video Link *
          </label>
          <p className="text-[11px] mb-2 text-text-secondary">
            Only YouTube videos are supported (e.g. intro/preview or class session)
          </p>
          <input
            type="text"
            required
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 text-sm border rounded-btn border-border-ui focus:outline-none focus:border-teal disabled:bg-surface-2 transition-colors"
            placeholder="https://www.youtube.com/watch?v=..."
            name="videoLink"
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-bold text-text-primary" htmlFor="description">
            Course Description
          </label>
          <textarea
            placeholder="Provide a detailed overview of what students will learn, expectations, and equipment needed..."
            name="description"
            disabled={isSubmitting}
            className="w-full p-3 text-sm border rounded-btn outline-none resize-none border-border-ui focus:border-teal disabled:bg-surface-2 transition-colors"
            rows="4"
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 text-sm font-bold text-white rounded-btn shadow-sm transition-all flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-teal/70 cursor-not-allowed'
                : 'bg-teal hover:bg-teal-600 shadow-md hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{uploadProgress || 'Adding Course...'}</span>
              </>
            ) : (
              <span>Add New Course</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClass