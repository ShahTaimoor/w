import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import useErrorLogout from '@/hooks/use-error-logout'
import axios from 'axios'
const Settings = () => {

    const { handleErrorLogout } = useErrorLogout()

    const changeUsername = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const previousUsername = formData.get('previousUsername')
        const newUsername = formData.get('newUsername')

        if (!newUsername) {
            toast('Username to change is required')
            return
        }

        try {
            const res = await axios.put(import.meta.env.VITE_API_URL + '/change-username', {
                previousUsername,
                newUsername
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })

            const data = await res.data
            localStorage.setItem('user', JSON.stringify(data.user))

            e.target.reset()

            return toast('Success')
        } catch (error) {
            return handleErrorLogout(error)
        }


    }
    const changePassword = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const previousPassword = formData.get('previousPassword')
        const newPassword = formData.get('newPassword')

        if (!newPassword || !previousPassword) {
            toast('PanewPassword to change is required')
            return
        }

        try {
            const res = await axios.put(import.meta.env.VITE_API_URL + '/change-password', {
                username: JSON.parse(localStorage.getItem('user')).username,
                previousPassword,
                newPassword
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })

            const data = await res.data
            localStorage.setItem('user', JSON.stringify(data.user))

            e.target.reset()

            return toast('Success')
        } catch (error) {
            return handleErrorLogout(error)
        }


    }
    return (
        <div className="w-[900px] sm:px-6 lg:px-8 py-8">
            {/* Change Username Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Username</h2>
                    <p className="text-gray-500">Update your account username</p>
                </div>

                <form onSubmit={changeUsername} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="currentUsername" className="block text-sm font-medium text-gray-700 mb-2">
                                Previous Username
                            </Label>
                            <Input
                                type="text"
                                name='previousUsername'
                                placeholder="Enter previous username"
                                className="py-6 rounded-lg"
                            />
                        </div>

                        <div>
                            <Label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-2">
                                New Username
                            </Label>
                            <Input
                                type="text"
                                name='newUsername'
                                placeholder="Enter new username"
                                className="py-6 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="rounded-lg px-8 py-6 text-base bg-primary hover:bg-primary/90"
                        >
                            Update Username
                        </Button>
                    </div>
                </form>
            </div>

            {/* Security Settings Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
                    <p className="text-gray-500">Manage your account security</p>
                </div>

                <form onSubmit={changePassword} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Previous Password
                            </Label>
                            <Input
                                type="text"
                                name='previousPassword'
                                placeholder="Enter previos password"
                                className="py-6 rounded-lg"
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password Password
                            </Label>
                            <Input
                                type="text"
                                name='newPassword'
                                placeholder="Confirm new password"
                                className="py-6 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="rounded-lg px-8 py-6 text-base bg-primary hover:bg-primary/90"
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Settings